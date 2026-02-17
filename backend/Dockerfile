FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    cmake \
    pkg-config \
    default-libmysqlclient-dev \
    default-mysql-client \
    ffmpeg \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-0 \
    libsndfile1 \
    espeak-ng \
    libjpeg-dev \
    libpng-dev \
    libopencv-dev \
    python3-opencv \
    libavformat-dev \
    libavcodec-dev \
    libavdevice-dev \
    libavutil-dev \
    libavfilter-dev \
    libswscale-dev \
    libswresample-dev \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install whisper without build isolation
RUN pip install --no-cache-dir --no-build-isolation openai-whisper

# Install remaining requirements
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

RUN mkdir -p media staticfiles logs models

RUN chmod +x manage.py

RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
