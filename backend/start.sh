#!/bin/bash

echo "Starting Ollama server..."
ollama serve &

echo "Waiting for Ollama to start..."
sleep 10

echo "Pulling Qwen coder model..."
ollama pull qwen2.5-coder:1.5b || true

echo "Starting Flask backend..."
gunicorn -b 0.0.0.0:7860 app:app --timeout 300