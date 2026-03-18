# VS Code Style AI Agent Builder - Quick Start

## 🎨 New UI Design

Your app now looks like **VS Code** with:

### Layout Components:
- **Activity Bar** (left side) - Quick access to Chat, Explorer, Search, Source Control, Debug
- **Sidebar** - Context-specific panels
- **Editor** - Main chat interface with tabs
- **Terminal** - Integrated command line at bottom
- **Command Palette** - Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)

## 🤖 AI Models Support

### Integrated Ollama Support
- Real-time model management
- Download recommended models directly from the app
- Full chat integration with all local models

### Recommended Lightweight Models:

**Ultra-Light (1-3GB):**
- `phi:2.7b` - ⚡⚡⚡ Instant responses, minimal resources
- `deepseek-coder:1.3b` - ⚡⚡⚡ Perfect for code gen
- `orca-mini:3b` - ⚡⚡⚡ Good quality, very fast

**Small (7GB):**
- `mistral:7b` - ⚡⚡ Versatile, good balance
- `neural-chat:7b` - ⚡⚡ Excellent for conversation
- `codellama:7b` - ⚡⚡ Advanced code generation

**Why NOT llama?**
- llama-2-7b is slow (~30s per response)
- High resource usage
- Better alternatives exist (mistral, neural-chat)

## 🚀 Quick Setup

### 1. Install Ollama
```bash
# macOS/Linux
visit https://ollama.ai and download

# Or via homebrew (macOS)
brew install ollama
```

### 2. Start Ollama
```bash
ollama serve
# Or let it auto-start on system boot
```

### 3. Download First Model (Choose One)
```bash
# Ultra-fast (recommended for first time)
ollama pull deepseek-coder:1.3b

# Or general purpose
ollama pull mistral:7b

# Or coding specialist
ollama pull codellama:7b
```

### 4. Run AI Agent Builder
```bash
# With Dev Server (hot reload)
npm run dev

# Or just React (faster startup)
npm start

# Or click the desktop icon
# Double-click: AI-Agent-Builder.desktop
```

## 🎯 Features

### Chat Interface
- Real-time chat with selected AI model
- Full conversation history
- Model switcher (in chat panel)
- Works with any Ollama-compatible model

### Model Manager
- See installed models
- Download recommended models
- View specs (size, speed, recommendations)
- Auto-refresh

### VS Code Features Implemented
- Activity Bar with 5 panels
- Tab navigation
- Command Palette (Ctrl+Shift+P)
- Terminal integration
- Sidebar with context panels

### Next Steps (Coming Soon)
- Code editor with syntax highlighting
- Project scaffolding
- Code generation with AI
- File explorer
- Git integration
- Debugging tools

## 🔧 Configuration

### Environment Variables (Optional)
Create `.env` file if using cloud AI:
```env
REACT_APP_OPENAI_API_KEY=sk-...
REACT_APP_CLAUDE_API_KEY=sk-...
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Open Command Palette |
| `Enter` | Send message in chat |
| `Ctrl+Alt+T` | Toggle Terminal |
| `Ctrl+B` | Toggle Sidebar |
| `1-5` | Switch Activity Bar panel |

## 📊 Model Performance Chart

```
Speed:        phi > deepseek > orca > neural-chat > mistral > codellama
Quality:      mistral > neural-chat > codellama > deepseek > orca > phi
Memory:       phi (2.7GB) < deepseek (1.3GB) < orca (3GB) < others (7GB)
Recommended:  deepseek (coding) or phi (lightweight)
```

## 🐛 Troubleshooting

### "Cannot connect to Ollama"
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If error, start Ollama
ollama serve

# Or on macOS (if installed via brew)
brew services start ollama
```

### "No models available"
```bash
# List your models
ollama list

# Download a model
ollama pull deepseek-coder:1.3b
```

### "App runs slow"
- Switch to lighter model (phi)
- Close other apps
- Reduce UI complexity
- Use faster CPU

### "Out of memory"
- Switch to micro model: `phi:2.7b`
- Close browser tabs
- Stop other services

## 📚 Resources

- Ollama Docs: https://ollama.ai
- Model Zoo: https://ollama.ai/library
- vs Code Design: https://code.visualstudio.com/docs/getstarted/userinterface
- React Docs: https://react.dev

## 💡 Pro Tips

1. **Start with phi** - It's tiny and instant
2. **Try deepseek for coding** - Optimized for code
3. **Use mistral for chat** - Best balance
4. **Keep Ollama running** - Background service
5. **Monitor system resources** - Check CPU/Memory
6. **Batch requests** - Faster than single messages
7. **Use command palette** - Productivity boost

## 🎉 You're All Set!

Open terminal and run:
```bash
npm run dev
```

Or double-click the desktop icon! 🚀

---

**Enjoy building with AI!** ✨
