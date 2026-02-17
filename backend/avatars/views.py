from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Avatar, AvatarImage, AvatarVoice
from .serializers import AvatarSerializer, AvatarImageSerializer, AvatarVoiceSerializer


class AvatarViewSet(viewsets.ModelViewSet):
    serializer_class = AvatarSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Avatar.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        avatar = self.get_object()
        serializer = AvatarImageSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(avatar=avatar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_voice(self, request, pk=None):
        avatar = self.get_object()
        serializer = AvatarVoiceSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(avatar=avatar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def finalize(self, request, pk=None):
        avatar = self.get_object()
        
        # Check if avatar has required data
        if not avatar.images.exists():
            return Response(
                {'error': 'Please upload at least one image'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        avatar.status = 'ready'
        avatar.save()
        
        return Response({
            'message': 'Avatar is ready!',
            'avatar': AvatarSerializer(avatar).data
        })
