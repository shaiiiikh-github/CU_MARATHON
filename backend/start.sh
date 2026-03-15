#!/bin/bash

# 1. Start the Ollama daemon in the background
echo "Starting Ollama server..."
ollama serve &

# 2. Wait a few seconds for Ollama to boot up
sleep 5

# 3. Pull your specific model (this takes time on the first boot!)
echo "Pulling Qwen model into Ollama..."
ollama pull qwen2.5-coder:3b

# 4. Start your Flask application
echo "Starting Flask Backend..."
gunicorn -b 0.0.0.0:8000 app:app --timeout 300