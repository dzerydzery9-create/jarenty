# Priorytet 2: Real IPC Tools - Implementation TODO
Status: Rozpoczęty | Ostatnia aktualizacja: Teraz

## Kroki do wykonania (kolejno):
- [x] 1. Stwórz src/types/IPCTypes.ts (interfejsy IPC)
- [x] 2. Edytuj electron/main.ts (dodaj IPC handlers: createFile, listFiles, execCommand z fs/child_process/child_process.spawn)
- [x] 3. Stwórz/Edytuj main/preload.ts (TS version preload.js, expose electronAPI z ipcRenderer.invoke)
- [x] 4. Edytuj src/plugin-system/AgentSystem.ts (tool handler'y → window.electronAPI calls)
- [x] 5. Edytuj agents/AgentTool.ts i agents/FileSystemAgent.ts (użyj AgentSystem lub direct API) ✅
- [ ] 6. Test: npm run dev, chat 'create test.txt with hello world' jako FileSystemAgent → plik utworzony
- [ ] 7. Aktualizuj TODO-steps.md [x] dla 2.1-2.4

**Po ukończeniu: Priorytet 3 VSCode Layout**

