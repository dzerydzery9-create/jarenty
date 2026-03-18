#!/bin/bash
# AI Agent Builder Launch Script

cd /home/jarek/ai-agent-builder

# Check if node_modules is installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start API server in background
echo "Starting Agent API server..."
npm run start-api &
API_PID=$!

# Wait for API to be ready
sleep 2

# Start the development server (React + Electron)
echo "Starting application..."
npm run dist || ./dist/AI-Agent-Builder_*_amd64.AppImage

# Cleanup on exit
trap "kill $API_PID" EXIT
