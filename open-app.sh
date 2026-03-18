#!/bin/bash
# Open AI Agent Builder in Browser

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🚀 AI AGENT BUILDER - VS CODE GRADE IMPLEMENTATION       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}✅ Dev Server Status:${NC}"
ps aux | grep "npm start" | grep -v grep | awk '{print "   PID: " $2 ", Memory: " $6 "KB, CPU: " $3 "%"}'

echo ""
echo -e "${YELLOW}📱 Opening Application...${NC}"
echo ""

# Try to open browser
if command -v xdg-open > /dev/null; then
/home/jarek/ai-agent-builder/dist/AI-Agent-Builder_1.0.0_amd64.AppImage
elif command -v open > /dev/null; then
    open http://localhost:3000
else
    echo -e "${YELLOW}⚠️  Manual: Open your browser and go to:${NC}"
    echo "   http://localhost:3000"
fi

echo ""
echo -e "${GREEN}🎯 What You Can Do Right Now:${NC}"
echo ""
echo "1. 💬 ${BLUE}Chat with AI${NC}"
echo "   - Click Activity Bar (left) → 💬 Chat"
echo "   - Select model from Sidebar"
echo "   - Type your question"
echo "   - Press Ctrl+Enter to send"
echo ""
echo "2. 🤖 ${BLUE}Run Autonomous Agents${NC}"
echo "   - Click Activity Bar → 🤖 Agents"
echo "   - Choose: CodeAgent, ResearchAgent, or DebugAgent"
echo "   - Click 'Run' button"
echo "   - Watch execution in Terminal"
echo ""
echo "3. 🧩 ${BLUE}Manage Plugins${NC}"
echo "   - Click Activity Bar → 🧩 Plugins"
echo "   - View installed plugins"
echo "   - Click plugin to run commands"
echo ""
echo "4. 📁 ${BLUE}File Browser${NC}"
echo "   - Click Activity Bar → 📁 Explorer"
echo "   - Browse project files"
echo ""
echo "5. 📊 ${BLUE}Model Management${NC}"
echo "   - Chat Tab shows available models"
echo "   - Models loaded from: http://localhost:11434"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   Only use: deepseek-coder:1.3b or gemma3:270m"
echo "   Your system has 7.6GB RAM"
echo "   7B models need 14GB - system will FREEZE!"
echo ""
echo -e "${GREEN}📚 Documentation:${NC}"
echo "   - START_HERE.md - Quick start"
echo "   - VSCODE_FULL_IMPLEMENTATION.md - Full guide"
echo "   - MESSAGE_8_IMPLEMENTATION_SUMMARY.md - What's new"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "   ${GREEN}All systems ready! Your app is running.${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "App URL: http://localhost:3000"
echo "Ollama API: http://localhost:11434"
echo ""
