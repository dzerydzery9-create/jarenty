# 🚀 AI Agent Builder - Quickstart Guide

## ✅ Status
- **Build**: ✅ Complete (Production-ready)
- **Desktop Icon**: ✅ Ready on Desktop
- **Launcher**: ✅ Configured and Executable
- **Ollama**: ✅ Installed with Models (deepseek-coder:1.3b, gemma3:270m)

---

## 🎯 How to Launch the App

### Method 1: Desktop Icon Click (Easiest) ⭐
1. **Look at your Desktop**
2. **Double-click** the icon labeled `AI-Agent-Builder.desktop`
3. **Wait** 3-5 seconds for the app to open
4. **Enjoy!** The VS Code-style AI app is now running

**Note**: If window doesn't appear immediately, wait another 5 seconds. Electron startup takes time on first run.

### Method 2: Command Line
```bash
bash /home/jarek/ai-agent-builder/launch.sh
```

### Method 3: Using npm dev (For Development)
```bash
cd /home/jarek/ai-agent-builder
npm run dev
```

---

## 🤖 AI Features

### Available Models
Your system has **Ollama** installed with these ready-to-use models:

| Model | Speed | Size | Best For |
|-------|-------|------|----------|
| `deepseek-coder:1.3b` | ⚡⚡⚡ Ultra Fast | 776 MB | Code generation, programming |
| `gemma3:270m` | ⚡⚡⚡ Super Fast | 291 MB | Quick answers, lightweight |

### Download More Models
```bash
ollama pull phi:2.7b           # 2.7GB - Fast general purpose
ollama pull mistral:7b         # 7GB - Powerful general model
ollama pull neural-chat:7b     # 7GB - Better for conversations
```

### Using AI in the App
1. **Open Model Manager** (sidebar)
2. **Select a model** from the dropdown
3. **Type your message** in the chat box
4. **Press Enter** to get AI response
5. Watch the **streaming response** in real-time!

---

## 📊 What's Included

### UI Components
- ✅ **Activity Bar** (Left: Chat, Explorer, Search, Source Control, Run)
- ✅ **Sidebar** (Context-aware panels)
- ✅ **Editor** (Main content area with tabs)
- ✅ **Terminal** (Command execution)
- ✅ **Command Palette** (Ctrl+Shift+P)
- ✅ **Model Manager** (Download & manage AI models)

### Features
- 🤖 Local AI integration (Ollama)
- 💬 Real-time chat with models
- 🎨 VS Code-inspired dark theme
- ⌨️ Keyboard shortcuts
- 📱 Clean, modern UI

---

## 🔧 Troubleshooting

### Desktop Icon Not Working?
1. Right-click the desktop icon
2. Select "Properties" or "Open With"
3. Try running: `bash /home/jarek/ai-agent-builder/launch.sh`

### App Crashes or Won't Start?
```bash
# Check for issues:
cd /home/jarek/ai-agent-builder
npm install --legacy-peer-deps
npm run build

# Then try launching:
npx electron .
```

### Ollama Not Responding?
```bash
# Start Ollama server:
ollama serve

# In another terminal, download a model:
ollama pull deepseek-coder:1.3b

# Try the app again
```

### Port 3000 Already in Use?
```bash
# Kill the process:
killall node
sleep 2

# Try launching again:
bash /home/jarek/ai-agent-builder/launch.sh
```

---

## 📁 Project Structure

```
/home/jarek/ai-agent-builder/
├── launch.sh ........................ Main launcher script ⭐
├── launch-prod.sh ................... Production launcher
├── open.sh .......................... Direct launcher
├── public/
│   ├── icon.png ..................... App icon
│   └── icon.svg ..................... Vector icon
├── src/
│   ├── components/ .................. React UI components
│   │   ├── Layout.tsx ............... Main layout engine
│   │   ├── ActivityBar.tsx .......... Left panel icons
│   │   ├── Sidebar.tsx ............. Context panels
│   │   ├── Editor.tsx .............. Chat & model selector
│   │   ├── Terminal.tsx ............ Terminal emulator
│   │   ├── CommandPalette.tsx ...... Command finder
│   │   └── ModelManager.tsx ........ Model downloader
│   └── services/
│       ├── OllamaService.ts ........ Ollama REST client
│       └── ModelRecommendations.ts . Model database
├── build/ ........................... Production bundle (1.1 MB)
└── Desktop/
    └── AI-Agent-Builder.desktop .... Desktop launcher entry ⭐
```

---

## 🎓 Tips & Tricks

### Faster Model Loading
Use **deepseek-coder:1.3b** or **gemma3:270m** - they're tiny and lightning-fast!

### Keyboard Shortcuts
- **Ctrl+Shift+P** - Open Command Palette
- **Ctrl+`** - Toggle terminal (when implemented)
- **Alt+1-5** - Switch between Activity Bar panels

### Pro Tip
Keep **Ollama running** in the background:
```bash
nohup ollama serve > /dev/null 2>&1 &
```

---

## 🚀 Next Steps

1. ✅ **Click the desktop icon** to open the app
2. 🤖 **Select a model** from the dropdown (deepseek-coder:1.3b is recommended)
3. 💬 **Type a message** and hit Enter
4. 🎉 **Watch the AI respond** in real-time!

---

## ℹ️ System Info

```
OS: Linux
Node.js: 18+
npm: 8+
Electron: 27.0.0
React: 18.2.0
Ollama: Installed ✅
Models: 2 ready, more available ✅
```

---

**Everything is set up! Just click the desktop icon and the app will launch! 🎯**

For issues: Check [BUILD_SUCCESS.md](BUILD_SUCCESS.md) or the console output.
