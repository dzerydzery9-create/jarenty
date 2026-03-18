#!/bin/bash

# AI Agent Builder Launcher - Safe Version (7.6GB RAM)
# Memory optimized to prevent system freeze

cd /home/jarek/ai-agent-builder

echo "🚀 Uruchamianie AI Agent Builder..."
echo "💾 Zoptymalizowany dla 7.6 GB RAM"
echo ""

# Kill any existing process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start Ollama with RAM limit if not running
if ! pgrep -x "ollama" > /dev/null 2>&1; then
    echo "🤖 Startowanie Ollama (z ograniczeniami)..."
    export OLLAMA_MAX_MEMORY=5368709120  # 5 GB limit
    export OLLAMA_NUM_THREAD=2
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    sleep 3
fi

echo "📱 Startowanie aplikacji... (Node memory: 512MB max)"

# Start React dev server with memory limits
export BROWSER=none
export PORT=3000
export SKIP_PREFLIGHT_CHECK=true
export CI=false
export NODE_OPTIONS="--max-old-space-size=512"

npm start > /tmp/ai-builder.log 2>&1 &
APP_PID=$!

echo "⏳ Czekam na aplikację..."
sleep 10

# Try to open in browser
echo "🌐 Otwieranie przeglądarki..."
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" 2>/dev/null &
fi

echo "✅ Aplikacja uruchomiona!"
echo "📍 Adres: http://localhost:3000"
echo ""
echo "💡 Jeśli przęglądarka się nie otworzyła, otwórz ręcznie: http://localhost:3000"

# Keep running
wait $APP_PID
