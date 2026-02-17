from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Avatar(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('creating', 'Creating'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='avatars')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='avatars/profiles/', blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='creating')
    personality_traits = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class AvatarImage(models.Model):
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='avatars/training/')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.avatar.name}"


class AvatarVoice(models.Model):
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE, related_name='voices')
    audio_file = models.FileField(upload_to='avatars/voices/')
    duration = models.FloatField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Voice for {self.avatar.name}"
