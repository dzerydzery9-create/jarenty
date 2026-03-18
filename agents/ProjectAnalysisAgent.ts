import BaseAgent, { AgentConfig, AgentTask, AgentResult } from './BaseAgent';

class ProjectAnalysisAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Project Analysis Agent',
      description: 'Analyzes codebase structure, dependencies, and architecture',
      capabilities: ['codebase-analysis', 'dependency-audit', 'architecture-review', 'security-scan'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust'],
    };
    super(config);
  }

  canHandle(task: AgentTask): boolean {
    return ['codebase-analysis', 'dependency-audit', 'architecture-review', 'security-scan'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { projectPath, files, dependencies } = task.input;

    let analysis = '';

    switch (task.type) {
      case 'codebase-analysis':
        analysis = await this.analyzeCodebase(files);
        break;
      case 'dependency-audit':
        analysis = await this.auditDependencies(dependencies);
        break;
      case 'architecture-review':
        analysis = await this.reviewArchitecture(files);
        break;
      case 'security-scan':
        analysis = await this.scanSecurity(files);
        break;
    }

    return {
      taskId: task.id,
      success: true,
      output: analysis,
      files: {},
    };
  }

  private async analyzeCodebase(files: string[]): Promise<string> {
    const analysis = {
      totalFiles: files.length,
      languages: this.detectLanguages(files),
      structure: this.analyzeStructure(files),
      patterns: this.identifyPatterns(files),
    };

    return `Codebase Analysis:

📊 Overview:
- Total Files: ${analysis.totalFiles}
- Languages: ${analysis.languages.join(', ')}

🏗️  Architecture:
${analysis.structure}

🔍 Code Patterns:
${analysis.patterns}

📈 Metrics:
- Component Count: ${files.filter(f => f.includes('component') || f.includes('Component')).length}
- Agent Count: ${files.filter(f => f.includes('Agent')).length}
- Test Coverage: ${this.estimateTestCoverage(files)}%`;
  }

  private async auditDependencies(dependencies: Record<string, string>): Promise<string> {
    const issues = [];
    const recommendations = [];

    // Check for outdated packages
    Object.entries(dependencies).forEach(([pkg, version]) => {
      if (version.includes('^') && pkg !== 'react' && pkg !== 'react-dom') {
        issues.push(`${pkg}: Loose version constraint may cause instability`);
      }
    });

    // Security recommendations
    if (!dependencies['helmet']) {
      recommendations.push('Add helmet for security headers');
    }
    if (!dependencies['express-rate-limit']) {
      recommendations.push('Add rate limiting for API protection');
    }

    return `Dependency Audit:

⚠️  Issues Found:
${issues.length > 0 ? issues.join('\n') : 'No critical issues'}

💡 Recommendations:
${recommendations.join('\n')}

🔒 Security Status: ${issues.length === 0 ? 'Good' : 'Needs attention'}`;
  }

  private async reviewArchitecture(files: string[]): Promise<string> {
    const architecture = {
      hasSeparationOfConcerns: this.checkSeparationOfConcerns(files),
      hasProperAbstraction: this.checkAbstractionLayers(files),
      followsBestPractices: this.checkBestPractices(files),
    };

    return `Architecture Review:

✅ Separation of Concerns: ${architecture.hasSeparationOfConcerns ? 'Good' : 'Needs improvement'}
✅ Abstraction Layers: ${architecture.hasProperAbstraction ? 'Good' : 'Needs improvement'}
✅ Best Practices: ${architecture.followsBestPractices ? 'Good' : 'Needs improvement'}

Recommendations:
- Consider implementing proper state management
- Add error boundaries for better error handling
- Implement proper logging system
- Add configuration management`;
  }

  private async scanSecurity(files: string[]): Promise<string> {
    const vulnerabilities = [];
    const securityIssues = [];

    files.forEach(file => {
      if (file.includes('.ts') || file.includes('.js')) {
        // Check for common security issues
        if (file.includes('eval(')) {
          securityIssues.push('Use of eval() - security risk');
        }
        if (file.includes('innerHTML')) {
          securityIssues.push('Direct innerHTML manipulation - XSS risk');
        }
        if (file.includes('localStorage') && !file.includes('encrypted')) {
          securityIssues.push('Plain localStorage usage - consider encryption');
        }
      }
    });

    return `Security Scan:

🚨 Critical Issues:
${securityIssues.length > 0 ? securityIssues.join('\n') : 'None found'}

🔐 Recommendations:
- Implement Content Security Policy (CSP)
- Use HTTPS for all communications
- Implement proper input validation
- Add authentication/authorization
- Regular security audits

Overall Security Rating: ${securityIssues.length === 0 ? 'A' : 'C'}`;
  }

  private detectLanguages(files: string[]): string[] {
    const extensions = files.map(f => f.split('.').pop()).filter(Boolean);
    const languages = new Set<string>();

    extensions.forEach(ext => {
      switch (ext) {
        case 'ts': case 'tsx': languages.add('TypeScript'); break;
        case 'js': case 'jsx': languages.add('JavaScript'); break;
        case 'py': languages.add('Python'); break;
        case 'java': languages.add('Java'); break;
        case 'cs': languages.add('C#'); break;
        case 'go': languages.add('Go'); break;
        case 'rs': languages.add('Rust'); break;
        case 'css': languages.add('CSS'); break;
        case 'html': languages.add('HTML'); break;
      }
    });

    return Array.from(languages);
  }

  private analyzeStructure(files: string[]): string {
    const structure = {
      hasComponents: files.some(f => f.includes('component')),
      hasServices: files.some(f => f.includes('service')),
      hasUtils: files.some(f => f.includes('util') || f.includes('helper')),
      hasTests: files.some(f => f.includes('test') || f.includes('spec')),
    };

    return Object.entries(structure)
      .map(([key, value]) => `${key}: ${value ? '✅' : '❌'}`)
      .join('\n');
  }

  private identifyPatterns(files: string[]): string {
    const patterns = [];

    if (files.some(f => f.includes('useState') || f.includes('useEffect'))) {
      patterns.push('React Hooks usage detected');
    }
    if (files.some(f => f.includes('async') || f.includes('await'))) {
      patterns.push('Async/await patterns');
    }
    if (files.some(f => f.includes('interface') || f.includes('type'))) {
      patterns.push('TypeScript type definitions');
    }

    return patterns.join('\n') || 'No specific patterns identified';
  }

  private estimateTestCoverage(files: string[]): number {
    const testFiles = files.filter(f => f.includes('test') || f.includes('spec')).length;
    const sourceFiles = files.filter(f => !f.includes('test') && !f.includes('spec')).length;
    return sourceFiles > 0 ? Math.round((testFiles / sourceFiles) * 100) : 0;
  }

  private checkSeparationOfConcerns(files: string[]): boolean {
    return files.some(f => f.includes('service')) &&
           files.some(f => f.includes('component')) &&
           files.some(f => f.includes('util'));
  }

  private checkAbstractionLayers(files: string[]): boolean {
    return files.some(f => f.includes('api') || f.includes('service')) &&
           files.some(f => f.includes('component'));
  }

  private checkBestPractices(files: string[]): boolean {
    return files.some(f => f.includes('error') || f.includes('Error')) &&
           files.some(f => f.includes('config') || f.includes('Config'));
  }
}

export default ProjectAnalysisAgent;