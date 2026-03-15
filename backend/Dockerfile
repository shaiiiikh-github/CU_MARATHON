# Start with a base image that has Python 3.10
FROM python:3.10-slim

# Install curl (needed to download Ollama)
RUN apt-get update && apt-get install -y curl

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set up the working directory for your app
WORKDIR /app

# Copy the requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your code and the 500MB model into the container
COPY . .

# Make the startup script executable
RUN chmod +x start.sh

# Expose the ports (11434 for Ollama, 8000 for Flask)
EXPOSE 11434
EXPOSE 8000

# Run the startup script
CMD ["./start.sh"]