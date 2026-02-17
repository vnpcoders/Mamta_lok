#!/usr/bin/env python3
"""
Download pre-trained models for avatar animation
"""
import os
import urllib.request

MODELS = {
    'wav2lip': 'https://github.com/Rudrabha/Wav2Lip/releases/download/models/wav2lip_gan.pth',
    # Add more model URLs as needed
}

def download_models():
    os.makedirs('models', exist_ok=True)
    
    for name, url in MODELS.items():
        print(f"Downloading {name}...")
        filepath = f"models/{name}.pth"
        if os.path.exists(filepath):
            print(f"  {name} already exists, skipping...")
            continue
        try:
            urllib.request.urlretrieve(url, filepath)
            print(f"  ✓ {name} downloaded")
        except:
            print(f"  ✗ {name} download failed (will use fallback)")

if __name__ == '__main__':
    download_models()
