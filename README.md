# AI Agent Builder

A powerful desktop application that combines an AI chat interface, integrated terminal, and intelligent agent system for building projects across all technology stacks.

## ✨ Features

- 🤖 **AI Chat Interface** - Communicate with multiple AI models (OpenAI, Claude, Ollama)
- 💻 **Integrated Terminal** - Built-in terminal emulator for command execution
- 🔧 **Agent System** - Intelligent agents that can generate and build projects
- 🌐 **Multi-Tech Support** - Support for all programming languages and frameworks
- 📝 **Code Editor** - Syntax-highlighted code editing capabilities
- 🎨 **Modern UI** - Built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron 27
- **Terminal**: xterm.js
- **State Management**: Zustand
- **AI Integration**: OpenAI/Claude/Ollama APIs

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- For AI features: API key for OpenAI, Claude, or local Ollama deployment

## 🚀 Quick Start

### Installation

```bash
cd /home/jarek/ai-agent-builder
npm install --legacy-peer-deps
```

### Development

Start the development environment (React dev server + Electron):

```bash
npm run dev
```

This will:
1. Start the React development server on http://localhost:3000
2. Launch Electron with hot-reloading

### Build for Production

```bash
npm run build-electron
```

Creates a distributable executable in `dist/` directory.

## 📁 Project Structure

```
ai-agent-builder/
├── src/                    # React components and pages
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── ChatInterface.tsx # Chat UI
│   │   └── Terminal.tsx     # Terminal component
│   ├── pages/             # Page components
│   ├── services/          # API services
│   │   └── AIService.ts    # AI model integration
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Main app component
│   ├── index.tsx          # React entry point
│   └── index.css          # Global styles
├── main/                  # Electron main process
│   ├── index.ts           # Electron app entry
│   └── preload.js         # IPC bridge
├── agents/                # AI agent implementations
│   ├── BaseAgent.ts       # Base agent class
│   ├── CodeGenerationAgent.ts # Code gen agent
│   └── AgentManager.ts    # Agent orchestration
├── terminal/              # Terminal integration
│   └── TerminalExecutor.ts # Command execution
├── public/                # Static assets
├── .vscode/               # VS Code settings
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_OPENAI_API_KEY=your-openai-key
REACT_APP_CLAUDE_API_KEY=your-claude-key
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434
```

### Build Configuration

Edit `package.json` `build` section to customize:
- Application name and ID
- Target platforms (Windows, macOS, Linux)
- Installation directory
- Auto-update settings

## 📚 Available Scripts

- `npm start` - Start React dev server (port 3000)
- `npm run dev` - Start Electron + React dev environment
- `npm run build` - Build React production bundle
- `npm run build-electron` - Build Electron app for current platform
- `npm run dist` - Create distributable packages
- `npm test` - Run test suite
- `npm run electron` - Launch Electron with current build

## 🤖 Agent System

The application includes an extensible agent system:

### Available Agents

1. **CodeGenerationAgent** - Generates boilerplate and project templates
   - Supported languages: Python, JavaScript, TypeScript, Java, Go, Rust, C#
   - Creates basic project scaffolds with package files

### Creating Custom Agents

Extend `BaseAgent` and implement:

```typescript
class MyAgent extends BaseAgent {
  async process(task: AgentTask): Promise<AgentResult> {
    // Your logic here
  }
  
  canHandle(task: AgentTask): boolean {
    // Return true if this agent can handle the task
  }
}
```

Register with `AgentManager`:

```typescript
const manager = AgentManager.getInstance();
manager.registerAgent(new MyAgent());
```

## 🎯 Core Features

### Chat Interface
- Real-time messaging with AI models
- Message history with timestamps
- Loading indicators
- Multi-model support (configurable)

### Terminal
- Integrated command execution
- Real-time output display
- xterm.js-based emulation
- Support for interactive commands

### Project Generation
- Multi-language templates
- Dependency management
- Git initialization
- Auto-scaffolding from descriptions

## 🔧 Troubleshooting

### npm install issues

If you encounter peer dependency conflicts:

```bash
npm install --legacy-peer-deps
npm install --force
```

### Electron won't start

1. Verify Node.js version: `node --version` (should be 18+)
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check environment: `npm run build` first (builds React output)

### Terminal not showing

- Check if xterm.js is installed: `npm list xterm`
- Verify terminal div is mounted in Layout.tsx

## 📦 Deployment

### Windows
```bash
npm run dist
# Creates .exe and portable versions
```

### macOS
```bash
npm run dist
# Creates .dmg and .zip
```

### Linux
```bash
npm run dist
# Creates AppImage and .deb
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open Pull Request

## 📝 Development Workflow

### Code Style
- Use TypeScript strictly
- Follow ESLint rules
- Format with Prettier (auto on save)

### Component Guidelines
- Functional components with hooks
- Props typed with TypeScript interfaces
- Reusable and composable design
- Proper error boundaries

### Testing
- Unit tests for utilities
- Component tests with React Testing Library
- Integration tests for agents

## 🚧 Roadmap

- [ ] Multi-tab editor support
- [ ] Plugin system for extending agents
- [ ] Database integration
- [ ] Cloud sync for projects
- [ ] Advanced debugging tools
- [ ] Performance profiling suite
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Project templates marketplace
- [ ] Team collaboration features

## 📄 License

MIT

## 💬 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create new issue with reproduction steps
3. Contact maintainers

---

**Built with ❤️ using React, Electron, and TypeScript**

