const { contextBridge } = require('electron');
const path = require('path');

// Dynamically import agents for main/renderer exposure
async function loadAgents() {
  const agentsDir = path.join(__dirname, '../agents');
  const fs = require('fs');
  const agentFiles = fs.readdirSync(agentsDir).filter(file => file.endsWith('.ts') && file !== 'BaseAgent.ts');
  
  const agentModules = {};
  for (const file of agentFiles) {
    const agentName = file.replace('.ts', '');
    try {
      agentModules[agentName] = require(`./../agents/${agentName}`);
    } catch (e) {
      console.warn(`Failed to load agent ${agentName}:`, e);
    }
  }
  
  // Init AgentManager
  const AgentManager = require('../agents/AgentManager').default;
  const agentManager = AgentManager.getInstance();
  
  return { agentManager, agentModules };
}

let agentManager: any = null;
let agentModules: any = null;

// Load agents on preload
loadAgents().then(({ agentManager: mgr, agentModules: mods }) => {
  agentManager = mgr;
  agentModules = mods;
  console.log('Agents loaded:', Object.keys(mods));
}).catch(console.error);

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => (window as any).electronAPI.ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: any) => (window as any).electronAPI.ipcRenderer.on(channel, listener),
  },
  AgentManager: () => agentManager,
  getAgentModules: () => agentModules,
});
