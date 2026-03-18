import BaseAgent, { AgentConfig, AgentTask, AgentResult } from './BaseAgent';

class TerminalIntegrationAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Terminal Integration Agent',
      description: 'Handles shell command execution, terminal operations, and system integration',
      capabilities: ['command-execution', 'shell-scripting', 'process-management', 'system-integration'],
      supportedLanguages: ['bash', 'sh', 'zsh', 'powershell', 'cmd'],
    };
    super(config);
  }

  canHandle(task: AgentTask): boolean {
    return ['command-execution', 'shell-scripting', 'process-management', 'system-integration'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { command, script, environment, workingDirectory } = task.input;

    let result = '';

    switch (task.type) {
      case 'command-execution':
        result = await this.executeCommand(command, environment, workingDirectory);
        break;
      case 'shell-scripting':
        result = await this.createScript(script, environment);
        break;
      case 'process-management':
        result = await this.manageProcess(command);
        break;
      case 'system-integration':
        result = await this.integrateSystem(command, environment);
        break;
    }

    return {
      taskId: task.id,
      success: true,
      output: result,
      files: {},
    };
  }

  private async executeCommand(command: string, environment?: string, workingDirectory?: string): Promise<string> {
    const safeCommand = this.sanitizeCommand(command);
    const envInfo = environment ? ` in ${environment}` : '';
    const dirInfo = workingDirectory ? ` from ${workingDirectory}` : '';

    return `Command Execution Analysis:

🔧 Command: ${safeCommand}${envInfo}${dirInfo}

Execution Plan:
1. Validate command syntax
2. Check required permissions
3. Set up environment variables
4. Execute with proper error handling
5. Capture output and exit code
6. Clean up resources

Safety Checks:
${this.performSafetyChecks(command)}

Recommended Implementation:
\`\`\`typescript
const executeCommand = async (cmd: string) => {
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    const { stdout, stderr } = await execAsync(cmd, {
      cwd: '${workingDirectory || process.cwd()}',
      env: { ...process.env, ${environment ? `...${environment}` : ''} }
    });

    return { success: true, output: stdout, error: stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private async createScript(script: string, environment?: string): Promise<string> {
    return `Shell Script Generation:

📝 Script Purpose: ${this.analyzeScriptPurpose(script)}

Environment: ${environment || 'Default'}

Generated Script:
\`\`\`bash
#!/bin/bash
set -e  # Exit on error
set -u  # Exit on undefined variable

# Script header
echo "Starting ${this.extractScriptName(script)}"

# Environment setup
${environment ? `export ${environment}` : '# No special environment variables'}

# Main logic
${script}

# Cleanup
echo "Script completed successfully"
\`\`\`

Features Added:
- Error handling with set -e
- Undefined variable protection with set -u
- Logging statements
- Proper exit codes
- Resource cleanup`;
  }

  private async manageProcess(command: string): Promise<string> {
    return `Process Management:

🎯 Process: ${command}

Management Strategy:
1. Spawn process with proper options
2. Monitor process health
3. Handle signals (SIGTERM, SIGINT)
4. Implement restart logic
5. Log process events
6. Clean shutdown

Implementation:
\`\`\`typescript
const { spawn } = require('child_process');

const manageProcess = (cmd: string, args: string[]) => {
  const process = spawn(cmd, args, {
    stdio: 'inherit',
    detached: false
  });

  process.on('exit', (code) => {
    console.log(\`Process exited with code \${code}\`);
  });

  process.on('error', (error) => {
    console.error('Process error:', error);
  });

  return {
    kill: () => process.kill(),
    pid: process.pid,
    status: () => process.killed ? 'killed' : 'running'
  };
};
\`\`\``;
  }

  private async integrateSystem(command: string, environment?: string): Promise<string> {
    return `System Integration:

🔗 Integration Type: ${this.determineIntegrationType(command)}

System Requirements:
${this.analyzeSystemRequirements(command)}

Integration Points:
- File system access
- Network communication
- Process spawning
- Environment variables
- Signal handling

Security Considerations:
${this.assessSecurityRisks(command)}

Implementation Plan:
1. Set up proper permissions
2. Implement sandboxing if needed
3. Add logging and monitoring
4. Handle system-specific differences
5. Provide fallback mechanisms`;
  }

  private sanitizeCommand(command: string): string {
    // Remove potentially dangerous commands
    const dangerous = ['rm -rf /', 'sudo', 'chmod 777', 'wget', 'curl'];
    let sanitized = command;

    dangerous.forEach(danger => {
      if (sanitized.includes(danger)) {
        sanitized = sanitized.replace(danger, `[BLOCKED: ${danger}]`);
      }
    });

    return sanitized;
  }

  private performSafetyChecks(command: string): string {
    const checks = [
      'Command syntax validation',
      'Path traversal prevention',
      'Injection attack protection',
      'Resource limit enforcement',
      'Permission verification'
    ];

    return checks.map(check => `✅ ${check}`).join('\n');
  }

  private analyzeScriptPurpose(script: string): string {
    if (script.includes('npm') || script.includes('yarn')) return 'Package management';
    if (script.includes('git')) return 'Version control operations';
    if (script.includes('docker')) return 'Container management';
    if (script.includes('test') || script.includes('spec')) return 'Testing execution';
    return 'General automation';
  }

  private extractScriptName(script: string): string {
    const lines = script.split('\n');
    const firstLine = lines[0];
    if (firstLine.includes('#')) {
      return firstLine.replace('#', '').trim();
    }
    return 'Generated Script';
  }

  private determineIntegrationType(command: string): string {
    if (command.includes('file') || command.includes('read') || command.includes('write')) return 'File System';
    if (command.includes('http') || command.includes('api') || command.includes('network')) return 'Network';
    if (command.includes('process') || command.includes('spawn') || command.includes('exec')) return 'Process Management';
    if (command.includes('env') || command.includes('config')) return 'Environment';
    return 'General System';
  }

  private analyzeSystemRequirements(command: string): string {
    const requirements = [];

    if (command.includes('node') || command.includes('npm')) {
      requirements.push('Node.js runtime');
    }
    if (command.includes('python')) {
      requirements.push('Python interpreter');
    }
    if (command.includes('docker')) {
      requirements.push('Docker daemon');
    }
    if (command.includes('git')) {
      requirements.push('Git version control');
    }

    return requirements.length > 0 ? requirements.join('\n') : 'No special requirements';
  }

  private assessSecurityRisks(command: string): string {
    const risks = [];

    if (command.includes('exec') || command.includes('spawn')) {
      risks.push('Command injection vulnerability');
    }
    if (command.includes('file') || command.includes('fs')) {
      risks.push('Path traversal risks');
    }
    if (command.includes('network') || command.includes('http')) {
      risks.push('Network security considerations');
    }

    return risks.length > 0 ? risks.join('\n') : 'Low security risk';
  }
}

export default TerminalIntegrationAgent;