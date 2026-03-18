export interface IPCFileArgs {
  path: string; // relative to project root
  content?: string;
}

export interface IPCExecArgs {
  command: string;
  args?: string[];
  cwd?: string; // default project root
}

export interface IPCResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListFilesArgs {
  path: string; // '.'
  recursive?: boolean;
}

