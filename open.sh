#!/bin/bash

# AI Agent Builder - Direct Launcher
# Simple one-liner launcher that works reliably

export DISPLAY=:0

# Ensure Ollama is running (optional, for AI features)
if ! pgrep -x "ollama" > /dev/null 2>&1; then
    nohup ollama serve > /dev/null 2>&1 &
fi

# Launch Electron app with production build
cd /home/jarek/ai-agent-builder && exec npx electron . 2>/dev/null &
exit 0
