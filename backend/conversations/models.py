from django.db import models
from django.contrib.auth import get_user_model
from avatars.models import Avatar

User = get_user_model()


class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} - {self.avatar.name}"


class Message(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('avatar', 'Avatar'),
    ]

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender_type = models.CharField(max_length=10, choices=SENDER_CHOICES)
    text_content = models.TextField()
    audio_file = models.FileField(upload_to='conversations/audio/', blank=True, null=True)
    audio_response = models.FileField(upload_to='audio/responses/', blank=True, null=True)  # NEW FIELD
    video_file = models.FileField(upload_to='conversations/video/', blank=True, null=True)
    emotion_detected = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender_type} - {self.text_content[:50]}"
