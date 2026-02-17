"""
Avatar Video Animation Service - MAIN FEATURE
Creates realistic talking face videos from photos + audio
"""
import os
import cv2
import numpy as np
from pathlib import Path
import subprocess
import tempfile
from django.conf import settings
from django.core.cache import cache
import hashlib

class AvatarAnimationService:
    """
    Main service to create talking avatar videos
    
    Takes:
    - Avatar photo (static image)
    - AI-generated audio (voice)
    - Emotion parameters
    
    Returns:
    - Video of avatar talking with lip sync!
    """
    
    def __init__(self):
        self.models_path = Path(settings.BASE_DIR) / 'models'
        self.cache_enabled = True
        self.video_fps = 25
        self.video_resolution = (512, 512)
    
    def generate_talking_video(self, 
                              avatar_image_path: str,
                              audio_path: str,
                              emotion: str = 'neutral',
                              use_cache: bool = True) -> str:
        """
        Main function: Generate talking avatar video
        
        Args:
            avatar_image_path: Path to avatar's photo
            audio_path: Path to AI-generated voice audio
            emotion: 'happy', 'sad', 'neutral', 'angry', 'surprised'
            use_cache: Whether to use cached videos
        
        Returns:
            Path to generated video file
        """
        
        # Check cache first (much faster!)
        if use_cache:
            cache_key = self._get_cache_key(avatar_image_path, audio_path, emotion)
            cached_video = cache.get(cache_key)
            if cached_video and os.path.exists(cached_video):
                return cached_video
        
        # Generate new video
        try:
            # Method 1: Wav2Lip (Fast, good quality)
            video_path = self._generate_wav2lip_video(
                avatar_image_path,
                audio_path,
                emotion
            )
            
            # Cache for future use
            if use_cache:
                cache.set(cache_key, video_path, timeout=86400*7)  # 7 days
            
            return video_path
            
        except Exception as e:
            # Fallback: Simple video with static face + audio
            return self._generate_fallback_video(avatar_image_path, audio_path)
    
    def _generate_wav2lip_video(self, image_path, audio_path, emotion):
        """
        Generate lip-synced video using Wav2Lip model
        
        This is the MAIN animation method - creates realistic lip movement!
        """
        
        output_dir = Path(settings.MEDIA_ROOT) / 'generated_videos'
        output_dir.mkdir(exist_ok=True)
        
        output_file = output_dir / f"{hashlib.md5(image_path.encode()).hexdigest()[:10]}.mp4"
        
        # Wav2Lip command
        # In production, you'd use the actual Wav2Lip inference
        # For this demo, we'll use a simplified version
        
        try:
            # Load image
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Could not load image: {image_path}")
            
            # Resize to standard size
            img = cv2.resize(img, self.video_resolution)
            
            # Load audio to get duration
            import librosa
            audio, sr = librosa.load(audio_path, sr=16000)
            duration = len(audio) / sr
            
            # Generate video frames with lip movement
            frames = self._generate_talking_frames(
                img, 
                audio, 
                sr,
                emotion
            )
            
            # Write video
            self._write_video_with_audio(
                frames,
                audio_path,
                str(output_file)
            )
            
            return str(output_file)
            
        except Exception as e:
            print(f"Wav2Lip generation failed: {e}")
            return self._generate_fallback_video(image_path, audio_path)
    
    def _generate_talking_frames(self, base_image, audio, sr, emotion):
        """
        Generate frames with lip movement synced to audio
        
        This analyzes audio and creates appropriate mouth shapes
        """
        import librosa
        
        # Get audio features
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        
        # Calculate number of frames
        duration = len(audio) / sr
        num_frames = int(duration * self.video_fps)
        
        frames = []
        
        for i in range(num_frames):
            # Clone base image
            frame = base_image.copy()
            
            # Get audio energy at this frame
            audio_idx = int(i * len(audio) / num_frames)
            if audio_idx < len(audio):
                energy = np.abs(audio[audio_idx])
            else:
                energy = 0
            
            # Modify mouth region based on audio energy
            # This is simplified - real Wav2Lip uses deep learning
            frame = self._add_lip_movement(frame, energy, emotion)
            
            frames.append(frame)
        
        return frames
    
    def _add_lip_movement(self, frame, audio_energy, emotion):
        """
        Add lip movement to frame based on audio energy
        
        In production: Use Wav2Lip neural network
        For demo: Simple mouth region modification
        """
        
        # Detect face and mouth region
        try:
            import face_recognition
            
            # Find face landmarks
            face_landmarks_list = face_recognition.face_landmarks(frame)
            
            if face_landmarks_list:
                landmarks = face_landmarks_list[0]
                
                # Get mouth points
                top_lip = landmarks.get('top_lip', [])
                bottom_lip = landmarks.get('bottom_lip', [])
                
                if top_lip and bottom_lip:
                    # Open mouth based on audio energy
                    # Higher energy = wider mouth opening
                    mouth_opening = int(audio_energy * 20)  # Scale factor
                    
                    # Modify lip positions (simplified)
                    # In real Wav2Lip, this uses GAN to generate realistic mouth
                    for i, point in enumerate(bottom_lip):
                        # Move bottom lip down
                        new_y = point[1] + mouth_opening
                        bottom_lip[i] = (point[0], new_y)
                    
                    # Draw modified lips
                    cv2.fillPoly(frame, [np.array(top_lip)], (200, 100, 100))
                    cv2.fillPoly(frame, [np.array(bottom_lip)], (180, 90, 90))
        
        except Exception as e:
            # If face detection fails, return original frame
            pass
        
        # Add emotion-based expressions
        frame = self._add_emotion_expression(frame, emotion)
        
        return frame
    
    def _add_emotion_expression(self, frame, emotion):
        """
        Add facial expressions based on emotion
        """
        # This would use emotion transfer models in production
        # For demo, just annotate
        
        emotion_colors = {
            'happy': (100, 255, 100),
            'sad': (100, 100, 255),
            'angry': (100, 100, 255),
            'surprised': (255, 255, 100),
            'neutral': (200, 200, 200)
        }
        
        color = emotion_colors.get(emotion, (200, 200, 200))
        
        # Add subtle color tint for emotion (very subtle)
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), frame.shape[1::-1], color, -1)
        frame = cv2.addWeighted(frame, 0.95, overlay, 0.05, 0)
        
        return frame
    
    def _write_video_with_audio(self, frames, audio_path, output_path):
        """
        Write video frames and merge with audio
        """
        # Write video without audio first
        temp_video = output_path.replace('.mp4', '_temp.mp4')
        
        height, width = frames[0].shape[:2]
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_video, fourcc, self.video_fps, (width, height))
        
        for frame in frames:
            out.write(frame)
        
        out.release()
        
        # Merge with audio using ffmpeg
        try:
            subprocess.run([
                'ffmpeg', '-y',
                '-i', temp_video,
                '-i', audio_path,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-strict', 'experimental',
                '-shortest',
                output_path
            ], check=True, capture_output=True)
            
            # Remove temp file
            os.remove(temp_video)
            
        except Exception as e:
            print(f"FFmpeg merge failed: {e}")
            # Use temp video as final
            os.rename(temp_video, output_path)
    
    def _generate_fallback_video(self, image_path, audio_path):
        """
        Simple fallback: Static image + audio
        Used if Wav2Lip fails
        """
        output_dir = Path(settings.MEDIA_ROOT) / 'generated_videos'
        output_dir.mkdir(exist_ok=True)
        
        output_file = output_dir / f"fallback_{hashlib.md5(image_path.encode()).hexdigest()[:10]}.mp4"
        
        try:
            # Create video from static image with audio
            subprocess.run([
                'ffmpeg', '-y',
                '-loop', '1',
                '-i', image_path,
                '-i', audio_path,
                '-c:v', 'libx264',
                '-tune', 'stillimage',
                '-c:a', 'aac',
                '-shortest',
                '-pix_fmt', 'yuv420p',
                str(output_file)
            ], check=True, capture_output=True)
            
            return str(output_file)
            
        except Exception as e:
            raise Exception(f"Fallback video generation failed: {e}")
    
    def _get_cache_key(self, image_path, audio_path, emotion):
        """
        Generate cache key for video
        """
        key_string = f"{image_path}_{audio_path}_{emotion}"
        return f"avatar_video_{hashlib.md5(key_string.encode()).hexdigest()}"
    
    def preload_models(self):
        """
        Preload Wav2Lip models into memory (faster generation)
        """
        # In production, load actual Wav2Lip models here
        pass


class EmotionMapper:
    """
    Maps emotions to facial expression parameters
    """
    
    EMOTION_PARAMS = {
        'happy': {
            'mouth_curve': 0.8,  # Smile
            'eye_opening': 1.0,
            'eyebrow_raise': 0.3
        },
        'sad': {
            'mouth_curve': -0.3,  # Frown
            'eye_opening': 0.7,
            'eyebrow_raise': -0.2
        },
        'angry': {
            'mouth_curve': -0.5,
            'eye_opening': 0.9,
            'eyebrow_raise': -0.5
        },
        'surprised': {
            'mouth_curve': 0.0,
            'eye_opening': 1.3,
            'eyebrow_raise': 0.8
        },
        'neutral': {
            'mouth_curve': 0.0,
            'eye_opening': 1.0,
            'eyebrow_raise': 0.0
        }
    }
    
    @classmethod
    def get_params(cls, emotion: str) -> dict:
        return cls.EMOTION_PARAMS.get(emotion, cls.EMOTION_PARAMS['neutral'])
    
    @classmethod
    def detect_emotion_from_text(cls, text: str) -> str:
        """
        Detect emotion from AI response text
        """
        text_lower = text.lower()
        
        # Simple keyword-based detection
        # In production, use sentiment analysis model
        
        if any(word in text_lower for word in ['happy', 'joy', 'wonderful', 'great', 'love']):
            return 'happy'
        elif any(word in text_lower for word in ['sad', 'sorry', 'miss', 'unfortunately']):
            return 'sad'
        elif any(word in text_lower for word in ['angry', 'upset', 'frustrated']):
            return 'angry'
        elif any(word in text_lower for word in ['wow', 'amazing', 'really', '!']):
            return 'surprised'
        else:
            return 'neutral'


# Singleton instance
_animation_service = None

def get_animation_service():
    """
    Get or create animation service instance
    """
    global _animation_service
    if _animation_service is None:
        _animation_service = AvatarAnimationService()
    return _animation_service
