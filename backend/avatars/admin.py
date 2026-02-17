from django.contrib import admin
from .models import Avatar, AvatarImage, AvatarVoice


class AvatarImageInline(admin.TabularInline):
    model = AvatarImage
    extra = 1


class AvatarVoiceInline(admin.TabularInline):
    model = AvatarVoice
    extra = 1


@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'relationship', 'status', 'created_at']
    list_filter = ['status', 'gender', 'created_at']
    search_fields = ['name', 'user__username', 'relationship']
    inlines = [AvatarImageInline, AvatarVoiceInline]
