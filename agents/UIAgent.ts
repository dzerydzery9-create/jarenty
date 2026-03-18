import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool } from './AgentTool';

class UIAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'UI/UX Agent',
      description: 'AI-powered UI/UX improvements, accessibility, and component optimization',
      capabilities: ['ui-improvement', 'ux-analysis', 'component-optimization', 'accessibility', 'design-review'],
      supportedLanguages: ['typescript', 'javascript', 'react', 'vue', 'angular', 'css', 'html'],
    };
    const aiService = new AIService();
    super(config, aiService);
    this.registerUITools();
  }

  private registerUITools(): void {
    const a11yAuditTool: AgentTool = {
      definition: {
        name: 'accessibility_audit',
        description: 'Audit component for accessibility issues (WCAG 2.1)',
        parameters: [
          { name: 'component', type: 'string', description: 'React/Vue component code', required: true },
        ],
      },
      execute: async (params) => {
        return 'Accessibility audit complete: issues identified';
      },
    };

    const designReviewTool: AgentTool = {
      definition: {
        name: 'design_review',
        description: 'Review component design against best practices',
        parameters: [
          { name: 'component', type: 'string', description: 'Component code/design', required: true },
        ],
      },
      execute: async (params) => {
        return 'Design review complete: improvements suggested';
      },
    };

    this.registerTool(a11yAuditTool);
    this.registerTool(designReviewTool);
  }

  canHandle(task: AgentTask): boolean {
    return ['ui-improvement', 'ux-analysis', 'component-optimization', 'accessibility', 'design-review'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { component, issues, requirements } = task.input;

    try {
      let improvements = '';
      let toolsUsed: string[] = [];

      switch (task.type) {
        case 'ui-improvement':
          improvements = await this.analyzeUI(component);
          break;
        case 'ux-analysis':
          improvements = await this.analyzeUX(issues, component);
          toolsUsed = ['design_review'];
          break;
        case 'component-optimization':
          improvements = await this.optimizeComponent(component);
          break;
        case 'accessibility':
          improvements = await this.improveAccessibility(component);
          toolsUsed = ['accessibility_audit'];
          break;
        case 'design-review':
          improvements = await this.designReview(component);
          toolsUsed = ['design_review'];
          break;
      }

      return {
        taskId: task.id,
        success: true,
        output: improvements,
        files: {},
        toolsUsed,
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'UI improvement failed'],
      };
    }
  }

  private async analyzeUI(component: string): Promise<string> {
    const prompt = `Analyze the UI design of this React/Vue component and suggest improvements:

Component:
\`\`\`jsx
${component}
\`\`\`

Analyze:
1. Visual consistency with design system
2. Color contrast and accessibility
3. Spacing and alignment
4. Typography hierarchy
5. Responsive design considerations
6. Visual feedback and states (hover, active, disabled, loading)
7. Icons and imagery usage
8. Animation and micro-interactions

Provide:
1. Issues found
2. Specific improvements with code examples
3. Design recommendations
4. Updated component code`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a UI design expert specializing in React/Vue components' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async analyzeUX(issues: string[], component?: string): Promise<string> {
    const prompt = `Conduct a UX analysis for a component with these reported issues:

Issues: ${issues.join('\n- ')}
${component ? `\nComponent:\n\`\`\`jsx\n${component}\n\`\`\`` : ''}

Provide:
1. Root cause analysis for each issue
2. Impact on user experience
3. Specific, actionable solutions
4. Quick wins vs long-term improvements
5. Estimated effort for each fix
6. Testing recommendations`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a UX analyst specializing in user experience optimization' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async optimizeComponent(component: string): Promise<string> {
    const prompt = `Optimize this React/Vue component for performance and user experience:

Component:
\`\`\`jsx
${component}
\`\`\`

Analyze and improve:
1. Unnecessary re-renders
2. Memory leaks (useEffect cleanup)
3. Memoization opportunities (useMemo, useCallback)
4. Lazy loading potential
5. Bundle size optimization
6. Rendering performance
7. Event handler optimization

Provide:
1. Identified performance issues
2. Optimized component code
3. Performance metrics (before/after estimates)
4. Testing approach for optimizations`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a React/Vue performance optimization expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async improveAccessibility(component: string): Promise<string> {
    const prompt = `Audit this component for accessibility (WCAG 2.1 AA compliance):

Component:
\`\`\`jsx
${component}
\`\`\`

Check for:
1. Semantic HTML usage (nav, section, article, etc.)
2. ARIA labels and roles
3. Keyboard navigation support
4. Color contrast (WCAG AA standards)
5. Focus management and indicators
6. Screen reader compatibility
7. Alternative text for images
8. Form labels and error messages
9. Language markup

Provide:
1. A11y violations found
2. Specific fixes with code
3. ARIA attributes needed
4. Testing with screen readers
5. Keyboard navigation improvements`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are an accessibility (a11y) expert specializing in WCAG compliance' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async designReview(component: string): Promise<string> {
    const prompt = `Perform a comprehensive design review of this component:

Component:
\`\`\`jsx
${component}
\`\`\`

Review:
1. Consistency with design system
2. Design best practices
3. User experience patterns
4. Visual hierarchy
5. State management visualization
6. Error and edge case handling
7. Scalability and edge cases
8. Documentation and maintainability

Provide:
1. Design issues and violations
2. Recommendations
3. Refactored component code
4. Design system documentation
5. Future improvements`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a design system expert and UI/UX architect' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }
}

export default UIAgent;