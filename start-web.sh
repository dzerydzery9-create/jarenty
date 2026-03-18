#!/bin/bash

# AI Agent Builder - Simple Web App Launcher
# Runs React app on http://localhost:3000

cd /home/jarek/ai-agent-builder

echo "🚀 Uruchamianie AI Agent Builder..."
echo "   Aplikacja otworzy się w przeglądarce..."
echo ""

# Check if Ollama is running
if ! pgrep -x "ollama" > /dev/null 2>&1; then
    echo "🤖 Startowanie Ollama..."
    nohup ollama serve > /dev/null 2>&1 &
    sleep 2
fi

# Kill any existing node process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start React development server
export BROWSER=none
nohup npm start > /tmp/ai-builder.log 2>&1 &
DEV_PID=$!

echo "⏳ Czekam na inicjalizację aplikacji..."
sleep 8

# Launch browser
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" 2>/dev/null &
elif command -v firefox &> /dev/null; then
    firefox "http://localhost:3000" 2>/dev/null &
elif command -v chromium &> /dev/null; then
    chromium "http://localhost:3000" 2>/dev/null &
elif command -v google-chrome &> /dev/null; then
    google-chrome "http://localhost:3000" 2>/dev/null &
else
    echo "✅ Aplikacja gotowa na: http://localhost:3000"
fi

wait $DEV_PID
