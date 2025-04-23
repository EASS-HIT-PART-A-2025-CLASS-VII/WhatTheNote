FROM ollama/ollama:latest

# Install curl for health checks in entrypoint
RUN apt-get update && apt-get install -y curl

# Expose Ollama's default port
EXPOSE 11434

COPY ollama-entrypoint.sh /ollama-entrypoint.sh
RUN chmod +x /ollama-entrypoint.sh

ENTRYPOINT ["/ollama-entrypoint.sh"]