from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
import os


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        text = request.data.get('text', '')

        if not text:
            return Response(
                {'error': 'Message text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user message
        user_message = Message.objects.create(
            conversation=conversation,
            sender_type='user',
            text_content=text
        )

        # Generate AI response (simple for now)
        ai_response_text = self.generate_ai_response(text, conversation.avatar)

        # Create avatar message
        avatar_message = Message.objects.create(
            conversation=conversation,
            sender_type='avatar',
            text_content=ai_response_text
        )

        return Response({
            'user_message': MessageSerializer(user_message).data,
            'avatar_message': MessageSerializer(avatar_message).data
        })

    def generate_ai_response(self, user_text, avatar):
        """
        Generate AI response using Gemini
        """
        gemini_key = os.environ.get('GEMINI_API_KEY', '')
        
        if not gemini_key:
            return f"Hello! I'm {avatar.name}. I'd love to chat, but the AI key is not configured."

        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Build prompt with avatar personality
            prompt = f"""You are {avatar.name}, a {avatar.relationship or 'person'}.
{avatar.description or ''}

Personality traits: {avatar.personality_traits}

Respond to this message as {avatar.name} would:
"{user_text}"

Keep response natural, warm, and in character."""

            response = model.generate_content(prompt)
            return response.text

        except Exception as e:
            return f"Hi! I'm {avatar.name}. I'm having trouble thinking right now, but I'm here with you."

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
