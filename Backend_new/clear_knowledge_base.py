"""
Script to clear all documents from the knowledge base.
Use this when you want to start fresh with new documents.
"""
import os
from pathlib import Path

def clear_knowledge_base():
    """Remove all JSON files from the knowledge_base directory"""
    knowledge_base = Path("knowledge_base")
    
    if not knowledge_base.exists():
        print("Knowledge base directory doesn't exist. Nothing to clear.")
        return
    
    json_files = list(knowledge_base.glob("*.json"))
    
    if not json_files:
        print("Knowledge base is already empty.")
        return
    
    print(f"Found {len(json_files)} document(s) in knowledge base:")
    for file in json_files:
        print(f"  - {file.name}")
    
    confirm = input("\nAre you sure you want to delete all documents? (yes/no): ")
    
    if confirm.lower() in ['yes', 'y']:
        for file in json_files:
            file.unlink()
            print(f"Deleted: {file.name}")
        print(f"\n✓ Cleared {len(json_files)} document(s) from knowledge base.")
        print("You can now add new documents using: python add_document.py <file> <name>")
    else:
        print("Cancelled. No documents were deleted.")

if __name__ == "__main__":
    clear_knowledge_base()

