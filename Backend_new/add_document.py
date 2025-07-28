# Example usage:
# python add_document.py "path/to/your/document.txt" "document_name"

import sys
import os
from chat_api.services.document_store import DocumentStore

def add_document(file_path: str, source_name: str = None):
    """Add a document to the knowledge base"""
    if not os.path.exists(file_path):
        print(f"File {file_path} not found!")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not source_name:
        source_name = os.path.basename(file_path)
    
    doc_store = DocumentStore()
    doc_store.add_document(content=content, source=source_name)
    print(f"Added document {source_name} to knowledge base!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python add_document.py <file_path> [source_name]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    source_name = sys.argv[2] if len(sys.argv) > 2 else None
    add_document(file_path, source_name)
