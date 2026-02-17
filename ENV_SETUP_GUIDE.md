# 🔧 Environment Setup Guide

## Quick Setup (1 Minute)

### Step 1: Backend Environment
```bash
cd backend
cp .env.example .env
nano .env  # or use any text editor
```

**Edit this line:**
```env
GEMINI_API_KEY=     # ← Add your key here!
```

**Get FREE Gemini key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Get API Key"
3. Copy the key
4. Paste in .env file
5. Save and exit

### Step 2: Frontend Environment
```bash
cd frontend
cp .env.example .env
# No changes needed for development!
```

### Step 3: Verify
```bash
# Check backend .env
cat backend/.env | grep GEMINI_API_KEY
# Should show: GEMINI_API_KEY=AIza...your_key

# Check frontend .env
cat frontend/.env | grep REACT_APP_API_URL
# Should show: REACT_APP_API_URL=http://localhost:8000/api
```

Done! ✅

---

## Complete Environment Variables Explanation

### Backend (.env)

#### 🔴 CRITICAL - Must Change

```env
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIza...your_key_here
```

#### 🟡 IMPORTANT - Review These

```env
# Django Secret Key (change in production!)
SECRET_KEY=django-insecure-dev-key-CHANGE-IN-PRODUCTION

# Debug mode (set to False in production)
DEBUG=True

# Allowed hosts (add your domain in production)
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
```

#### 🟢 DATABASE - Default Works

```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=ai_avatar
DB_USER=avataruser
DB_PASSWORD=password123
DB_HOST=localhost  # Use 'mysql' for Docker
DB_PORT=3306
```

#### 🟢 REDIS - Default Works

```env
REDIS_URL=redis://localhost:6379/0
# Use redis://redis:6379/0 for Docker
```

#### 🟢 SPEECH - Default Works

```env
# Whisper model size
WHISPER_MODEL=base  # Options: tiny, base, small, medium, large

# TTS engine
TTS_ENGINE=coqui  # Options: coqui, gtts, pyttsx3
```

#### 🟢 VIDEO ANIMATION - Default Works

```env
ANIMATION_METHOD=wav2lip  # Best lip sync
VIDEO_FPS=25
VIDEO_RESOLUTION=512x512
ENABLE_VIDEO_CACHE=True
USE_GPU=False  # Set True if you have NVIDIA GPU
```

---

### Frontend (.env)

#### 🟢 ALL - Default Works

```env
# Backend URL
REACT_APP_API_URL=http://localhost:8000/api

# WebSocket URL
REACT_APP_WS_URL=ws://localhost:8000/ws

# WebRTC (for video calls)
REACT_APP_STUN_SERVER=stun:stun.l.google.com:19302

# Features
REACT_APP_ENABLE_VIDEO_CALL=true
REACT_APP_ENABLE_VOICE_CHAT=true
REACT_APP_ENABLE_TEXT_CHAT=true
```

---

## Docker Setup

When using Docker, your .env files stay the same, but Docker Compose automatically handles host names:

### backend/.env for Docker
```env
GEMINI_API_KEY=your_key_here

# These are auto-updated by Docker Compose:
DB_HOST=mysql        # ← Docker service name
REDIS_URL=redis://redis:6379/0  # ← Docker service name
```

### frontend/.env for Docker
```env
# Use localhost when accessing from browser
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
```

---

## Production Setup

### Backend (.env for Production)
```env
# Security
SECRET_KEY=generate-new-secret-key-here-64-chars-long
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (production database)
DB_HOST=your-db-server.com
DB_NAME=ai_avatar_prod
DB_USER=prod_user
DB_PASSWORD=strong_password_here

# AI API
GEMINI_API_KEY=your_production_key

# GPU
USE_GPU=True  # If you have GPU on production server

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env for Production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com/ws
REACT_APP_STUN_SERVER=stun:stun.l.google.com:19302
```

---

## Common Issues & Solutions

### Issue 1: GEMINI_API_KEY not working
```bash
# Check if key is set
echo $GEMINI_API_KEY

# Should output your key. If empty:
source backend/.env
export GEMINI_API_KEY=your_key_here
```

### Issue 2: Database connection error
```bash
# Check MySQL is running
mysql -u avataruser -p ai_avatar

# If fails, check DB_HOST in .env
# For local: DB_HOST=localhost
# For Docker: DB_HOST=mysql
```

### Issue 3: Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:8000/api/

# Check REACT_APP_API_URL in frontend/.env
# Should be: http://localhost:8000/api
```

### Issue 4: WebSocket connection failed
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Check REDIS_URL in backend/.env
```

---

## Environment File Templates

### Minimal .env (Just to Get Started)
```env
# backend/.env
GEMINI_API_KEY=your_key_here
DEBUG=True
DB_HOST=localhost
REDIS_URL=redis://localhost:6379/0
```

### Full .env (All Features)
Use the `.env.example` files - they have everything!

---

## Verification Checklist

Before running the app, verify:

- [ ] `backend/.env` exists
- [ ] `backend/.env` has GEMINI_API_KEY
- [ ] `frontend/.env` exists
- [ ] `frontend/.env` has REACT_APP_API_URL
- [ ] MySQL is running (if not using Docker)
- [ ] Redis is running (if not using Docker)

```bash
# Quick verification script
if [ -f backend/.env ] && grep -q "GEMINI_API_KEY=" backend/.env && [ -f frontend/.env ]; then
    echo "✅ Environment files OK!"
else
    echo "❌ Missing .env files!"
fi
```

---

## Getting API Keys (All FREE!)

### 1. Google Gemini (REQUIRED)
- Visit: https://makersuite.google.com/app/apikey
- Click "Get API Key"
- No credit card required
- FREE: 60 req/min, 1500 req/day

### 2. HuggingFace (Optional)
- Visit: https://huggingface.co/settings/tokens
- Create account (free)
- Generate token
- FREE forever

---

## Need Help?

1. Check this guide
2. Check README.md
3. Check .env.example files
4. All settings are documented inline

**Remember: Only GEMINI_API_KEY is required. Everything else has working defaults!**
