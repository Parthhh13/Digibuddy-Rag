import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import json
import logging
import os
from torch.utils.data import Dataset, DataLoader
from typing import List, Dict
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatDataset(Dataset):
    def __init__(self, conversations, tokenizer, max_length=512):
        self.encodings = []
        for conv in conversations:
            # Format: Human: question\nAssistant: answer
            text = f"Human: {conv['question']}\nAssistant: {conv['answer']}\n"
            
            encoding = tokenizer(
                text,
                truncation=True,
                max_length=max_length,
                padding="max_length",
                return_tensors="pt"
            )
            self.encodings.append({
                'input_ids': encoding['input_ids'][0],
                'attention_mask': encoding['attention_mask'][0]
            })

    def __len__(self):
        return len(self.encodings)

    def __getitem__(self, idx):
        return self.encodings[idx]

class ModelTrainer:
    def __init__(
        self,
        base_model: str = "microsoft/DialoGPT-medium",
        output_dir: str = "fine_tuned_model",
        max_length: int = 200
    ):
        self.base_model = base_model
        self.output_dir = output_dir
        self.max_length = max_length
        
        logger.info(f"Initializing with base model: {base_model}")
        
        # Initialize tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(base_model)
        self.model = AutoModelForCausalLM.from_pretrained(base_model)
        
        # Add padding token if not present
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model.config.pad_token_id = self.tokenizer.eos_token_id

    def train(
        self,
        conversations: List[Dict[str, str]],
        num_epochs: int = 7,
        batch_size: int = 1,
        learning_rate: float = 1e-5,
        warmup_steps: int = 100,
        gradient_accumulation_steps: int = 4
    ):
        """Train the model using basic PyTorch training loop."""
        logger.info("Starting training...")
        
        # Prepare dataset
        dataset = ChatDataset(conversations, self.tokenizer, self.max_length)
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
        
        # Setup training
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(device)
        
        # Initialize optimizer with weight decay
        optimizer = torch.optim.AdamW(
            self.model.parameters(),
            lr=learning_rate,
            weight_decay=0.01
        )
        
        # Training loop
        self.model.train()
        total_steps = len(dataloader) * num_epochs
        progress_steps = max(1, total_steps // 100)
        
        for epoch in range(num_epochs):
            total_loss = 0
            start_time = time.time()
            
            for batch_idx, batch in enumerate(dataloader):
                # Get inputs
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                
                # Forward pass
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=input_ids
                )
                loss = outputs.loss
                
                # Scale loss by gradient accumulation steps
                loss = loss / gradient_accumulation_steps
                loss.backward()
                
                # Update weights every gradient_accumulation_steps
                if (batch_idx + 1) % gradient_accumulation_steps == 0:
                    torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
                    optimizer.step()
                    optimizer.zero_grad()
                
                total_loss += loss.item() * gradient_accumulation_steps
                
                # Log progress
                global_step = epoch * len(dataloader) + batch_idx
                if (global_step + 1) % progress_steps == 0:
                    logger.info(
                        f"Epoch {epoch + 1}/{num_epochs} | Batch {batch_idx + 1}/{len(dataloader)} | "
                        f"Loss: {loss.item() * gradient_accumulation_steps:.4f}"
                    )
            
            # End of epoch logging
            avg_loss = total_loss / len(dataloader)
            time_taken = time.time() - start_time
            logger.info(
                f"Epoch {epoch + 1}/{num_epochs} completed | "
                f"Average Loss: {avg_loss:.4f} | "
                f"Time: {time_taken:.2f}s"
            )
            
            # Save checkpoint after each epoch
            checkpoint_dir = os.path.join(self.output_dir, f"checkpoint-epoch-{epoch + 1}")
            os.makedirs(checkpoint_dir, exist_ok=True)
            self.model.save_pretrained(checkpoint_dir)
            self.tokenizer.save_pretrained(checkpoint_dir)
            logger.info(f"Saved checkpoint to {checkpoint_dir}")
        
        # Save final model
        logger.info("Training completed. Saving final model...")
        self.model.save_pretrained(self.output_dir)
        self.tokenizer.save_pretrained(self.output_dir)
        logger.info(f"Model and tokenizer saved to {self.output_dir}")

if __name__ == "__main__":
    # Load the prepared training data
    with open(r"D:\Internship\CollegeTips\digibuddy-chat-guide\Backend_new\training_data\training_data.json", "r", encoding="utf-8") as f:
        conversations = json.load(f)
    
    logger.info(f"Loaded {len(conversations)} conversations for training")
    
    # Initialize trainer
    trainer = ModelTrainer(
        base_model="microsoft/DialoGPT-medium",
        output_dir="fine_tuned_model",
        max_length=200
    )
    
    # Train the model
    trainer.train(conversations) 