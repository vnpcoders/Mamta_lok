from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['user', 'avatar', 'title', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'avatar__name', 'title']
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender_type', 'text_content', 'created_at']
    list_filter = ['sender_type', 'created_at']
    search_fields = ['text_content']
