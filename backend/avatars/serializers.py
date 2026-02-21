from rest_framework import serializers
from .models import Avatar, AvatarImage, AvatarVoice


class AvatarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvatarImage
        fields = ['id', 'image', 'is_primary', 'uploaded_at']


class AvatarVoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvatarVoice
        fields = ['id', 'audio_file', 'duration', 'uploaded_at']


class AvatarSerializer(serializers.ModelSerializer):
    images = AvatarImageSerializer(many=True, read_only=True)
    voices = AvatarVoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Avatar
        fields = [
            'id', 'name', 'relationship', 'description', 'profile_image',
            'gender','language' ,'status', 'personality_traits', 'created_at',
            'updated_at', 'images', 'voices'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
