# AI Agent Builder - Szczegółowy Plan Wdrożenia Fazy 2
Status: Rozpoczęty | Ostatnia aktualizacja: Teraz

## 🎯 Priorytet 1: Qwen + Electron Fix (1-2h)
- [x] **1.1** Edytuj `src/services/AIService.ts`: ✅ Pełna integracja Ollama + Qwen params/stream

- [x] **1.3** Fix `package.json`: \"dev\": electron pure + concurrently HMR (no browser popup)\n- [x] **1.4** Test: `npm run dev` → Uruchomione (REACT start, czeka na Electron + wait-on). Sprawdź chat \"hello\" w Electron → Qwen.\n\n**Next: Priorytet 2 - IPC Tools**

## 🎯 Priorytet 2: Real Tools IPC (2-3h)
- [ ] **2.1** `electron/main.ts`: Dodaj IPC handlers (createFile/readFile/execCommand → fs/child_process)
- [ ] **2.2** `main/preload.js`: Expose electronAPI + AgentManager
- [ ] **2.3** `src/plugin-system/AgentSystem.ts`: Handlery → ipcRenderer.invoke('createFile')
- [ ] **2.4** Test: Chat \"create test.txt z 'hello'\" → plik utworzony

## 🎯 Priorytet 3: VS Code Full Layout + Workflow (2h)
- [ ] **3.1** `src/App.tsx`: Użyj FullVSCodeLayout z chat/editor/terminal
- [ ] **3.2** Agent results → Editor display + 'Apply files' button
- [ ] **3.3** Terminal integration z agent exec

## 🎯 Phase 4: Advanced (po testach)
- [ ] ProgramBuilderAgent orchestrator
- [ ] Multi-agent plans
- [ ] Build todo app end-to-end
- [ ] npm run dist → ikona executable

## Test Commands
\`\`\`bash
# Check Ollama
curl http://localhost:11434/api/tags

# Dev Electron
npm run dev

# Build
npm run build-electron
\`\`\`

**Aktualizuj po każdym [x]!**
