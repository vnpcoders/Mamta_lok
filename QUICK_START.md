# Quick Start - AI Memory Avatar

## What This Does

Talk to your deceased loved ones through AI:
- See their FACE on screen (animated from photos)
- Hear their VOICE (cloned from samples)
- Watch their LIPS MOVE as they speak
- See EMOTIONS on their face
- Have natural conversations

## 5-Minute Setup

```bash
# 1. Extract
unzip ai-avatar-final.zip
cd ai-avatar-final

# 2. Get FREE Gemini API key (2 min)
# Visit: https://makersuite.google.com/app/apikey
# No credit card needed!

# 3. Add key
echo "GEMINI_API_KEY=your_key" >> backend/.env

# 4. Start (automatic setup)
docker-compose up -d

# 5. Setup database
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# 6. Create avatar
# - Go to http://localhost:3000
# - Upload 5-10 photos of loved one
# - Upload 2-3 voice samples (10-30 seconds each)
# - Add personality traits
# - Click "Create Avatar"

# 7. Start video call!
# - Click "Video Call"
# - Talk naturally
# - Watch them respond with animated face!
```

## How It Works

```
YOU SPEAK
    ↓
WHISPER recognizes speech
    ↓
GEMINI AI thinks as loved one
    ↓
COQUI TTS creates their voice
    ↓
WAV2LIP animates their face
    ↓
YOU SEE & HEAR THEM! 😊
```

## Cost

- Development: $0/month
- Production: $25-35/month (server only)
- AI (Gemini): FREE forever!

## System Requirements

- 8GB RAM (16GB recommended)
- 20GB disk space
- GPU optional (faster video generation)
- Internet for AI (Gemini API)

See README.md for full documentation.
