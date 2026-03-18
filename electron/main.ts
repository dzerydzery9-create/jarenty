// Main Electron entry point - VS Code Style
// Language: TypeScript
// Stack: Electron + TypeScript + Web Components

import { app, BrowserWindow, Menu, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { IPCFileArgs, IPCExecArgs, IPCResult, ListFilesArgs } from '../src/types/IPCTypes';

let mainWindow: BrowserWindow | null;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload.ts'),
      sandbox: true
    },
    icon: path.join(__dirname, '..', 'assets', 'icon.png')
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'bottom' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for plugin system
ipcMain.handle('plugin:load', async (event, pluginPath) => {
  try {
    const plugin = require(pluginPath);
    return { success: true, data: plugin };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('plugin:list', async () => {
  const pluginDir = path.join(app.getPath('userData'), 'plugins');
  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
  }
  return fs.readdirSync(pluginDir);
});

ipcMain.handle('model:list', async () => {
  // Query Ollama API
  const response = await fetch('http://localhost:11434/api/tags');
  return response.json();
});

ipcMain.handle('model:run', async (event, modelName, prompt) => {
  // Stream response from Ollama
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({ model: modelName, prompt, stream: false })
  });
  return response.json();
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile', 'multiSelections']
  });
  return { canceled, filePaths };
});

ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory']
  });
  return { canceled, filePaths };
});

// File system operations for plugins
ipcMain.handle('fs:readFile', async (event, filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
});

ipcMain.handle('fs:writeFile', async (event, filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf-8');
});

// === Nowe IPC handlers dla Agent Tools ===

const PROJECT_ROOT = '/home/jarek/ai-agent-builder'; // CWD projektu

// Waliduj path - prevent ../ escapes
function validatePath(relPath: string): string {
  const safePath = path.normalize(relPath).replace(/^(\.\.(\/|\\\\|$))/, '');
  return path.join(PROJECT_ROOT, safePath);
}

// createFile
ipcMain.handle('createFile', async (event: IpcMainInvokeEvent, args: IPCFileArgs): Promise<IPCResult> => {
  try {
    const fullPath = validatePath(args.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, args.content || '', 'utf8');
    return { success: true, data: { path: args.path } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// listFiles
ipcMain.handle('listFiles', async (event: IpcMainInvokeEvent, args: ListFilesArgs): Promise<IPCResult> => {
  try {
    const fullPath = validatePath(args.path || '.');
    const files = fs.readdirSync(fullPath, { withFileTypes: true });
    const result = files.map(f => ({ name: f.name, isDirectory: f.isDirectory(), isFile: f.isFile() }));
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// execCommand
ipcMain.handle('execCommand', async (event: IpcMainInvokeEvent, args: IPCExecArgs): Promise<IPCResult> => {
  return new Promise((resolve) => {
    const fullCwd = args.cwd ? validatePath(args.cwd) : PROJECT_ROOT;
    const proc = spawn(args.command, args.args || [], { cwd: fullCwd, shell: true });
    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => { stdout += data.toString(); });
    proc.stderr?.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      resolve({
        success: code === 0,
        data: { stdout, stderr, code },
        error: code !== 0 ? stderr : undefined
      });
    });
  });
});

// App event handlers
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Build menu
const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' }
    ]
  },
  {
    label: 'Plugins',
    submenu: [
      { label: 'Install Plugin...', accelerator: 'Ctrl+Shift+X' },
      { label: 'Manage Plugins', accelerator: 'Ctrl+Shift+P' }
    ]
  }
]);

Menu.setApplicationMenu(menu);

export {};
