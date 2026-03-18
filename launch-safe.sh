#!/bin/bash

# AI Agent Builder - Optimized Launcher with RAM Protection
# Prevents system freeze by limiting Ollama memory usage

cd /home/jarek/ai-agent-builder

echo "🚀 Uruchamianie AI Agent Builder (Zoptymalizowana Wersja)"
echo ""
echo "💾 System RAM: 7.6 GB"
echo "📊 Dla bezpieczeństwa limituję Ollama do 5 GB"
echo ""

# Kill any existing processes
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start Ollama with RAM limit (5GB max to prevent freeze)
# Ollama thread limit prevents runaway threads
if ! pgrep -x "ollama" > /dev/null 2>&1; then
    echo "🤖 Startowanie Ollama (z ograniczeniami RAM)..."
    
    # Set environment variables for Ollama
    export OLLAMA_MAX_MEMORY=5368709120  # 5 GB limit
    export OLLAMA_NUM_THREAD=2           # Limit threads
    
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    OLLAMA_PID=$!
    sleep 3
    
    echo "   ✅ Ollama startowana (PID: $OLLAMA_PID)"
else
    echo "✅ Ollama już uruchomiona"
fi

echo ""
echo "📱 Startowanie aplikacji..."

# React dev server with optimizations
export BROWSER=none
export PORT=3000
export SKIP_PREFLIGHT_CHECK=true
export CI=false
export NODE_OPTIONS="--max-old-space-size=512"  # Limit Node memory

npm start > /tmp/ai-builder.log 2>&1 &
APP_PID=$!

echo "⏳ Czekam na aplikację (10 sekund)..."
sleep 10

# Open browser
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" 2>/dev/null &
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ AI Agent Builder - GOTOWA                           ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  📍 Adres: http://localhost:3000                         ║"
echo "║  🤖 Modele: deepseek-coder:1.3b, gemma3:270m            ║"
echo "║  💾 RAM Limit: 5 GB (bezpiecznie dla 7.6 GB)           ║"
echo "║                                                          ║"
echo "║  💡 TIP: Dla lepszej wydajności:                        ║"
echo "║     • Zamknij VS Code                                   ║"
echo "║     • Nie uruchamiaj innych ciężkich aplikacji          ║"
echo "║     • Używaj gemma3:270m dla szybkości                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "⏹️  Aby zatrzymać: Ctrl+C"

# Keep running
wait $APP_PID
