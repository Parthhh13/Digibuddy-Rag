from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.chat_service import ChatService
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class ChatbotView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chat_service = ChatService()

    def post(self, request, *args, **kwargs):
        try:
            message = request.data.get('message')
            if not message:
                return Response(
                    {"error": "Message is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get chat history if provided
            chat_history = request.data.get('chat_history', [])

            # Generate response
            response = self.chat_service(message, chat_history)

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in ChatbotView: {str(e)}")
            return Response(
                {
                    "error": "An error occurred while processing your request",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
