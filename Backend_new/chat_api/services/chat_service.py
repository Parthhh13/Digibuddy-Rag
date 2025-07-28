
from typing import Dict, Any, List
import logging
import os
from dotenv import load_dotenv
import google.generativeai as genai
from .document_store import DocumentStore

logger = logging.getLogger(__name__)
load_dotenv()  # Load environment variables from .env file

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

class ChatService:
    def __init__(self):
        if not GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set in environment. Gemini API calls will fail.")
        self.document_store = DocumentStore()

    def generate_response(self, message: str, chat_history: list = None) -> Dict[str, Any]:
        if not GEMINI_API_KEY:
            return {
                "response": "Gemini API key not set on server. Please contact admin.",
                "status": "error"
            }

        try:
            logger.info(f"Initializing Gemini with API key: {'*' * (len(GEMINI_API_KEY) - 4) + GEMINI_API_KEY[-4:] if GEMINI_API_KEY else 'None'}")
            
            # Initialize the model
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            # Prepare the system message and user query
            system_message = """You are DigiBuddy, a friendly digital guide helping people understand technology. 
            Remember to:
            1. Use simple, everyday language - no technical jargon
            2. Explain things like you're talking to a friend
            3. Keep responses short and clear
            4. Use examples from daily life
            5. Break down complex concepts into simple steps
            6. Be patient and encouraging
            7. Dont give a very long response, keep it concise

            If you need to use a technical term, always explain it in parentheses right after.
            """
            
            # Get relevant documents
            relevant_docs = self.document_store.get_relevant_chunks(message)
            
            # Add context from documents if available
            context = ""
            sources = []
            if relevant_docs:
                context = "\n\nRelevant information from our knowledge base:\n"
                for doc in relevant_docs:
                    context += f"\n- {doc['content']}"
                    sources.append(doc['source'])
            
            formatted_message = f"{system_message}\n{context}\n\nUser Question: {message}\n\nYour simple response:"
            logger.info(f"Sending message to Gemini: {message[:100]}...")
            response = model.generate_content(formatted_message)

            # Add source attribution if sources were used
            response_text = response.text
            if sources:
                response_text += f"\n\nThis information comes from: {', '.join(sources)}"

            if response.text:
                logger.info("Successfully received response from Gemini")
                return {
                    "response": response_text,
                    "status": "success"
                }
            
            logger.error("Received empty response from Gemini")
            return {
                "response": "No response generated from Gemini API.",
                "status": "error"
            }
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return {
                "response": "Error contacting Gemini API.",
                "status": "error",
                "error": str(e)
            }

    def __call__(self, message: str, chat_history: list = None) -> Dict[str, Any]:
        return self.generate_response(message, chat_history)