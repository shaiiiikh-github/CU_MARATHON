FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl git zstd && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Make start script executable
RUN chmod +x start.sh

# HuggingFace port
EXPOSE 7860

# Start backend
CMD ["./start.sh"]