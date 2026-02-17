from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AvatarViewSet

router = DefaultRouter()
router.register(r'', AvatarViewSet, basename='avatar')

urlpatterns = [
    path('', include(router.urls)),
]
