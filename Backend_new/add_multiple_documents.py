"""
Script to add multiple documents to the knowledge base at once.
Usage: python add_multiple_documents.py
"""
from chat_api.services.document_store import DocumentStore
import os
from pathlib import Path

def add_multiple_documents():
    """Interactive script to add multiple documents"""
    doc_store = DocumentStore()
    
    print("=== Add Multiple Documents to Knowledge Base ===\n")
    print("Enter document paths (one per line).")
    print("Press Enter twice when done.\n")
    
    documents = []
    while True:
        file_path = input("Document file path (or press Enter to finish): ").strip()
        if not file_path:
            break
        
        if not os.path.exists(file_path):
            print(f"⚠ File not found: {file_path}")
            continue
        
        source_name = input(f"  Source name for '{os.path.basename(file_path)}' (or press Enter for filename): ").strip()
        if not source_name:
            source_name = os.path.basename(file_path)
        
        documents.append((file_path, source_name))
        print(f"  ✓ Added to queue: {source_name}\n")
    
    if not documents:
        print("No documents to add.")
        return
    
    print(f"\nAdding {len(documents)} document(s)...\n")
    
    for file_path, source_name in documents:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            doc_store.add_document(content=content, source=source_name)
            print(f"✓ Added: {source_name}")
        except Exception as e:
            print(f"✗ Failed to add {source_name}: {e}")
    
    print(f"\n✓ Completed! Added {len(documents)} document(s) to knowledge base.")
    print("Restart your Django server to load the new documents.")

if __name__ == "__main__":
    add_multiple_documents()

