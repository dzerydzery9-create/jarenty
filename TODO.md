# TODO: Expand Agents for Program Building Assistance

Status: In progress

## Approved Plan Steps

### Phase 1: Setup & Integration (Current)
- [x] Create TODO.md for tracking
- [x] Update AgentManager.ts: Registered key agents (CodeGen, UI, Debug, Test, ProjectAnalysis, FileSystem)
- [x] ChatInterface.tsx: Connected to AgentManager.autoExecuteTask() for real agent dispatch on chat input. Fixed TS errors.
- [x] main/preload.js: Exposed AgentManager to renderer via contextBridge, dynamic agent loading.
- [x] AIService.ts: Integrated with Ollama for real AI calls.
- [x] CodeGenerationAgent.ts: Uses AI service for dynamic code gen, returns generated files.
- Implement real tool handlers in AgentSystem.ts (FS, exec stubs → real IPC)

### Phase 2: Core Agent Enhancements
- Enhance CodeGenerationAgent: Dynamic Ollama-based code gen + real file creation
- Update DebuggingAgent, TestingAgent, etc. with tools
- Create ProgramBuilderAgent (orchestrator)

### Phase 3: UI Integration
- ChatInterface.tsx: Connect to AgentManager.autoExecuteTask(), parse user intent → task
- Add agent selector, progress, file apply buttons
- Editor/Terminal: Agent outputs integration

### Phase 4: Full Workflow & Polish
- IPC in main/index.ts for agent tools
- Update AIService to use Ollama
- Test end-to-end: 'build todo app'
- [ ] attempt_completion

Next step: Update AgentManager.ts to register all agents and integrate Ollama/AIAgent system.

Updated after each major step.
