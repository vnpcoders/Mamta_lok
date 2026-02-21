from gtts import gTTS
from langdetect import detect
import os
from django.conf import settings

class TTSService:
    """
    Multi-language Text-to-Speech Service
    Supports: Hindi, English, Tamil, Telugu, Marathi, Bengali, etc.
    """
    
    LANGUAGE_MAP = {
        'en': 'en',      # English
        'hi': 'hi',      # Hindi
        'ta': 'ta',      # Tamil
        'te': 'te',      # Telugu
        'mr': 'mr',      # Marathi
        'bn': 'bn',      # Bengali
        'gu': 'gu',      # Gujarati
        'kn': 'kn',      # Kannada
        'ml': 'ml',      # Malayalam
        'pa': 'pa',      # Punjabi
    }
    
    @staticmethod
    def detect_language(text):
        """Auto-detect language from text"""
        try:
            detected = detect(text)
            return TTSService.LANGUAGE_MAP.get(detected, 'en')
        except:
            return 'en'
    
    @staticmethod
    def generate_speech(text, language=None, avatar_id=None):
        """
        Generate speech audio file
        Returns: audio file path
        """
        if not language:
            language = TTSService.detect_language(text)
        
        # Create audio file
        try:
            tts = gTTS(text=text, lang=language, slow=False)
            
            # Save to media/audio/
            audio_dir = os.path.join(settings.MEDIA_ROOT, 'audio', 'responses')
            os.makedirs(audio_dir, exist_ok=True)
            
            filename = f"response_{avatar_id}_{hash(text)}.mp3"
            filepath = os.path.join(audio_dir, filename)
            
            tts.save(filepath)
            
            # Return relative path for URL
            return f"audio/responses/{filename}"
        
        except Exception as e:
            print(f"TTS Error: {e}")
            return None
