import json
import csv
import argparse
from typing import List, Dict

def read_csv(file_path: str) -> List[Dict[str, str]]:
    """Read QA pairs from a CSV file."""
    conversations = []
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            conversations.append({
                'question': row['question'],
                'answer': row['answer']
            })
    return conversations

def read_json(file_path: str) -> List[Dict[str, str]]:
    """Read QA pairs from a JSON file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def save_conversations(conversations: List[Dict[str, str]], output_file: str):
    """Save conversations to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(conversations, f, indent=2, ensure_ascii=False)

def main():
    parser = argparse.ArgumentParser(description='Prepare training dataset')
    parser.add_argument('--input', required=True, help='Input file path (CSV or JSON)')
    parser.add_argument('--output', default='training_data.json', help='Output JSON file path')
    args = parser.parse_args()

    # Determine file type and read accordingly
    if args.input.endswith('.csv'):
        conversations = read_csv(args.input)
    elif args.input.endswith('.json'):
        conversations = read_json(args.input)
    else:
        raise ValueError("Input file must be either CSV or JSON")

    # Save the processed conversations
    save_conversations(conversations, args.output)
    print(f"Processed {len(conversations)} conversations and saved to {args.output}")

if __name__ == "__main__":
    main() 