import { contextBridge, ipcRenderer } from 'electron';
import type { IPCFileArgs, IPCExecArgs, ListFilesArgs, IPCResult } from '../src/types/IPCTypes';

// Expose safe API do renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  ipcRenderer: {
    invoke: <T = unknown>(channel: string, args?: any): Promise<T> => {
      return ipcRenderer.invoke(channel, args);
    },
    // Nie expose on/send dla bezpieczeństwa
  },
  // Type-safe tool wrappers (opcjonalnie)
  tools: {
    createFile: async (args: IPCFileArgs): Promise<IPCResult> => {
      return ipcRenderer.invoke('createFile', args);
    },
    listFiles: async (args: ListFilesArgs): Promise<IPCResult> => {
      return ipcRenderer.invoke('listFiles', args);
    },
    execCommand: async (args: IPCExecArgs): Promise<IPCResult> => {
      return ipcRenderer.invoke('execCommand', args);
    },
  },
});

// Debug: console.log('Preload loaded, electronAPI exposed');

