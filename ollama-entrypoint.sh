#!/bin/sh
set -e

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be ready
until curl --fail http://ollama:11434/api/tags; do
  echo "Waiting for Ollama to start..."
  sleep 2
done

# Pull the ollama model
ollama pull gemma3:1b

# Wait for background Ollama process (keep container running)
wait