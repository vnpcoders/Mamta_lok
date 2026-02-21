from rest_framework import viewsets, status
from rest_framework.decorators import action
from .tts_service import TTSService
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

        # Generate audio
        try:
            audio_path = TTSService.generate_speech(
               text=ai_response_text,
               language=conversation.avatar.language,
               avatar_id=conversation.avatar.id
            )
            if audio_path:
                avatar_message.audio_response = audio_path
                avatar_message.save()
        except Exception as e:
            print(f"TTS failed: {e}")

        return Response({
            'user_message': MessageSerializer(user_message).data,
            'avatar_message': MessageSerializer(avatar_message).data
        })

    def generate_ai_response(self, user_text, avatar):
        """Generate AI response using Gemini"""
        gemini_key = os.environ.get('GEMINI_API_KEY', '')
        
        if not gemini_key:
            return f"Hello! I'm {avatar.name}. AI key is not configured."

        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            
            # Try multiple model names
            model_names = [
                'gemini-1.5-flash',
                'gemini-1.5-pro-latest',
                'gemini-pro',
                'models/gemini-1.5-flash',
                'models/gemini-pro'
            ]
            
            model = None
            for model_name in model_names:
                try:
                    model = genai.GenerativeModel(model_name)
                    # Quick test
                    test = model.generate_content("Hi")
                    print(f"Using model: {model_name}")
                    break
                except:
                    continue
            
            if not model:
                return f"Hi! I'm {avatar.name}. Technical issue right now."
            
            # Build prompt
            prompt = f"""You are {avatar.name}, a {avatar.relationship or 'person'}.
{avatar.description or ''}

Respond naturally to: "{user_text}"

Keep it warm. Reply in same language."""

            response = model.generate_content(prompt)
            return response.text

        except Exception as e:
            print(f"Gemini Error: {e}")
            return f"Hi! I'm {avatar.name}. I'm having a moment, but I'm listening."
        
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
