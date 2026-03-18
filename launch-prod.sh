#!/bin/bash

# Simple production launcher for AI Agent Builder
# This script directly runs Electron with the production build

cd /home/jarek/ai-agent-builder

# Ensure build exists
if [ ! -d "build" ]; then
    echo "🔨 Building application..."
    npm run build --silent
fi

# Start Ollama in background if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo "🤖 Starting Ollama..."
    ollama serve > /dev/null 2>&1 &
    sleep 2
fi

# Run Electron with production build
exec npx electron . "$@" 2>/dev/null || exec npx electron . "$@"
