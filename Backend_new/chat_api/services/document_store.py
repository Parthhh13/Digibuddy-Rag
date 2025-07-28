from typing import List, Dict
import os
from pathlib import Path
import json
import google.generativeai as genai

class DocumentStore:
    def __init__(self, docs_dir: str = "knowledge_base"):
        self.docs_dir = Path(docs_dir)
        self.docs_dir.mkdir(exist_ok=True)
        self.documents = []
        self.load_documents()

    def add_document(self, content: str, source: str, metadata: Dict = None) -> None:
        """Add a document to the store and save it"""
        doc = {
            "content": content,
            "source": source,
            "metadata": metadata or {},
            "embedding": None  # Will be computed when needed
        }
        self.documents.append(doc)
        self._save_document(doc)

    def _save_document(self, doc: Dict) -> None:
        """Save a document to disk"""
        filename = Path(doc["source"]).stem
        filepath = self.docs_dir / f"{filename}.json"
        with open(filepath, 'w', encoding='utf-8') as f:
            # Save without embedding as it's not JSON serializable
            doc_to_save = doc.copy()
            doc_to_save.pop("embedding", None)
            json.dump(doc_to_save, f, ensure_ascii=False, indent=2)

    def load_documents(self) -> None:
        """Load all documents from disk"""
        self.documents = []
        if not self.docs_dir.exists():
            return
        
        for file in self.docs_dir.glob("*.json"):
            with open(file, 'r', encoding='utf-8') as f:
                self.documents.append(json.load(f))

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using Gemini API"""
        # Use Gemini's embedding model
        embedding_model = "models/embedding-001"
        result = genai.embed_content(
            model=embedding_model,
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']

    def get_relevant_chunks(self, query: str, top_k: int = 2) -> List[Dict]:
        """Get the most relevant document chunks for a query"""
        query_embedding = self._get_embedding(query)
        
        # Compute embeddings for documents if not already computed
        for doc in self.documents:
            if doc.get("embedding") is None:
                doc["embedding"] = self._get_embedding(doc["content"])
        
        # Compute similarities
        def compute_similarity(doc_embedding):
            # Simple dot product similarity
            return sum(q * d for q, d in zip(query_embedding, doc_embedding))
        
        # Sort documents by similarity
        scored_docs = [
            (compute_similarity(doc["embedding"]), doc)
            for doc in self.documents
        ]
        scored_docs.sort(reverse=True)
        
        # Return top_k most relevant documents
        return [
            {
                "content": doc["content"],
                "source": doc["source"],
                "metadata": doc.get("metadata", {}),
                "similarity": score
            }
            for score, doc in scored_docs[:top_k]
            if score > 0.7  # Only include if similarity is high enough
        ]
