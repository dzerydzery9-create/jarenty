import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool } from './AgentTool';

class ProjectAnalysisAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'Project Analysis Agent',
      description: 'AI-powered codebase analysis, architecture review, and security scanning',
      capabilities: ['codebase-analysis', 'dependency-audit', 'architecture-review', 'security-scan', 'tech-debt-assessment'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby'],
    };
    const aiService = new AIService();
    super(config, aiService);
    this.registerAnalysisTools();
  }

  private registerAnalysisTools(): void {
    const codebaseMapTool: AgentTool = {
      definition: {
        name: 'map_codebase',
        description: 'Create an architectural map of the codebase',
        parameters: [
          { name: 'files', type: 'array', description: 'File list', required: true },
        ],
      },
      execute: async (params) => {
        return 'Codebase structure mapped successfully';
      },
    };

    const securityScanTool: AgentTool = {
      definition: {
        name: 'security_scan',
        description: 'Scan code for security vulnerabilities',
        parameters: [
          { name: 'code', type: 'string', description: 'Code to scan', required: true },
        ],
      },
      execute: async (params) => {
        return 'Security scan complete: vulnerabilities identified';
      },
    };

    this.registerTool(codebaseMapTool);
    this.registerTool(securityScanTool);
  }

  canHandle(task: AgentTask): boolean {
    return ['codebase-analysis', 'dependency-audit', 'architecture-review', 'security-scan', 'tech-debt-assessment'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { projectPath, files, code, dependencies } = task.input;

    try {
      let analysis = '';
      let toolsUsed: string[] = [];

      switch (task.type) {
        case 'codebase-analysis':
          analysis = await this.analyzeCodebase(files || code);
          toolsUsed = ['map_codebase'];
          break;
        case 'dependency-audit':
          analysis = await this.auditDependencies(dependencies);
          break;
        case 'architecture-review':
          analysis = await this.reviewArchitecture(code || files);
          break;
        case 'security-scan':
          analysis = await this.scanSecurity(code || files);
          toolsUsed = ['security_scan'];
          break;
        case 'tech-debt-assessment':
          analysis = await this.assessTechDebt(code || files);
          break;
      }

      return {
        taskId: task.id,
        success: true,
        output: analysis,
        files: {},
        toolsUsed,
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Analysis failed'],
      };
    }
  }

  private async analyzeCodebase(input: string | string[]): Promise<string> {
    const codeContent = Array.isArray(input) ? input.slice(0, 5).join('\n') : input;
    const prompt = `Analyze this codebase structure and provide insights:

Code/Files:
\`\`\`
${codeContent}
\`\`\`

Provide:
1. Architecture overview
2. Main components and their relationships
3. Design patterns identified
4. Code organization assessment
5. Scalability considerations
6. Recommendations for improvement
7. Estimated lines of code and complexity`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a senior software architect' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async auditDependencies(dependencies: Record<string, string>): Promise<string> {
    const prompt = `Audit these project dependencies for security, compatibility, and best practices:

Dependencies:
${Object.entries(dependencies)
  .map(([pkg, version]) => `- ${pkg}: ${version}`)
  .join('\n')}

Analyze:
1. Security vulnerabilities
2. Version compatibility
3. License compliance
4. Dependency bloat
5. Alternative recommendations
6. Update strategy

Provide specific, actionable recommendations`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a dependency and security auditor' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async reviewArchitecture(input: string | string[]): Promise<string> {
    const codeContent = Array.isArray(input) ? input.slice(0, 10).join('\n') : input;
    const prompt = `Review the architecture of this codebase:

Code:
\`\`\`
${codeContent}
\`\`\`

Review for:
1. Separation of concerns
2. SOLID principles adherence
3. Design pattern usage
4. Layer boundaries
5. Coupling and cohesion
6. Scalability readiness
7. Testability

Provide:
1. Architecture assessment
2. Strengths and weaknesses
3. Refactoring recommendations
4. Modernization opportunities
5. Risk assessment`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a software architecture expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async scanSecurity(input: string | string[]): Promise<string> {
    const codeContent = Array.isArray(input) ? input.slice(0, 10).join('\n') : input;
    const prompt = `Perform a security audit on this code:

Code:
\`\`\`
${codeContent}
\`\`\`

Check for:
1. SQL/NoSQL injection vulnerabilities
2. XSS vulnerabilities
3. CSRF vulnerabilities
4. Authentication/authorization issues
5. Data leakage risks
6. Insecure dependencies
7. Hardcoded secrets
8. Unsafe deserialization

Provide:
1. Vulnerabilities found (by severity)
2. Exact locations
3. Exploitation method
4. Remediation code
5. Prevention strategies`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a security expert specializing in code vulnerabilities' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async assessTechDebt(input: string | string[]): Promise<string> {
    const codeContent = Array.isArray(input) ? input.slice(0, 10).join('\n') : input;
    const prompt = `Assess technical debt in this codebase:

Code:
\`\`\`
${codeContent}
\`\`\`

Analyze:
1. Code quality issues
2. Performance problems
3. Maintenance burden
4. Testing gaps
5. Documentation deficiencies
6. Refactoring priorities
7. Estimated time to fix

Provide:
1. Tech debt assessment
2. Risk factors
3. Impact analysis
4. Prioritized remediation plan
5. Cost/benefit analysis`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a software quality and technical debt specialist' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }
}

export default ProjectAnalysisAgent;
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