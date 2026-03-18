import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool } from './AgentTool';
import { AgentKnowledge } from './AgentKnowledge';

class TestingAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'Testing Agent',
      description: 'AI-powered comprehensive test generation and automation',
      capabilities: ['unit-testing', 'integration-testing', 'e2e-testing', 'test-automation', 'coverage-analysis'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby'],
    };
    const aiService = new AIService();
    super(config, aiService);
    this.registerTestingTools();
  }

  private registerTestingTools(): void {
    const generateTestTool: AgentTool = {
      definition: {
        name: 'generate_tests',
        description: 'Generate comprehensive test cases',
        parameters: [
          { name: 'code', type: 'string', description: 'Code to test', required: true },
          { name: 'testType', type: 'string', description: 'unit/integration/e2e', required: true },
          { name: 'language', type: 'string', description: 'Programming language', required: true },
        ],
      },
      execute: async (params) => {
        return `Test suite generated for ${params.testType} testing`;
      },
    };

    const analyzeCoverageTool: AgentTool = {
      definition: {
        name: 'analyze_coverage',
        description: 'Analyze test coverage gaps',
        parameters: [
          { name: 'code', type: 'string', description: 'Code to analyze', required: true },
          { name: 'existingTests', type: 'string', description: 'Existing test code', required: false },
        ],
      },
      execute: async (params) => {
        return 'Coverage analysis complete: identified gaps';
      },
    };

    this.registerTool(generateTestTool);
    this.registerTool(analyzeCoverageTool);
  }

  canHandle(task: AgentTask): boolean {
    return ['unit-testing', 'integration-testing', 'e2e-testing', 'test-automation', 'coverage-analysis'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { component, code, language, testType, coverage } = task.input;

    try {
      let result = '';
      let testFiles: Record<string, string> = {};
      let toolsUsed: string[] = ['generate_tests'];

      switch (task.type) {
        case 'unit-testing':
          result = await this.createUnitTests(component || code, language);
          testFiles[`${component || 'test'}.test.${this.getExtension(language)}`] = result;
          break;
        case 'integration-testing':
          result = await this.createIntegrationTests(component || code, language);
          testFiles[`${component || 'test'}.integration.test.${this.getExtension(language)}`] = result;
          break;
        case 'e2e-testing':
          result = await this.createE2ETests(component || code, language);
          testFiles[`${component || 'test'}.e2e.${this.getExtension(language)}`] = result;
          break;
        case 'test-automation':
          result = await this.setupTestAutomation(language, coverage);
          break;
        case 'coverage-analysis':
          result = await this.analyzeCoverage(code, language);
          toolsUsed.push('analyze_coverage');
          break;
      }

      return {
        taskId: task.id,
        success: true,
        output: result,
        files: testFiles,
        toolsUsed,
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Test generation failed'],
      };
    }
  }

  private async createUnitTests(component: string, language: string): Promise<string> {
    const framework = this.getTestFramework(language);
    const prompt = `Generate comprehensive unit tests for this ${language} component/function using ${framework}:

Component:
\`\`\`${language}
${component}
\`\`\`

Create unit tests that cover:
1. Happy path scenarios
2. Edge cases and boundary conditions
3. Error/exception handling
4. Invalid inputs
5. Performance considerations

Format as valid ${language} test code with:
- Clear test names
- Proper mocking where needed
- Assertions for each test
- Setup/teardown if needed
- Comments explaining complex tests`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a ${language} testing expert specializing in ${framework}` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async createIntegrationTests(component: string, language: string): Promise<string> {
    const prompt = `Generate comprehensive integration tests for this ${language} component:

Component:
\`\`\`${language}
${component}
\`\`\`

Create integration tests that verify:
1. Component interactions with dependencies
2. API calls and responses
3. Database operations
4. Event flows
5. Error scenarios with real dependencies

Provide working integration test code with proper setup/teardown"`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a ${language} integration testing expert` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async createE2ETests(component: string, language: string): Promise<string> {
    const prompt = `Generate end-to-end tests for this ${language} component/feature:

Component:
\`\`\`${language}
${component}
\`\`\`

Create realistic E2E test scenarios that:
1. Simulate real user workflows
2. Test complete feature flows
3. Verify UI/UX interactions
4. Check data persistence
5. Test error recovery paths

Use Playwright/Cypress patterns if applicable`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are an end-to-end testing expert for ${language}` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async setupTestAutomation(language: string, coverage?: number): Promise<string> {
    const testFramework = this.getTestFramework(language);
    const prompt = `Setup automated testing for ${language} project using ${testFramework}:

Provide:
1. Test runner configuration
2. Coverage configuration (target: ${coverage || 80}%)
3. CI/CD pipeline setup
4. Code coverage reports
5. Test organization structure
6. Mock/stub strategy
7. Test data management
8. Performance testing setup

Format as configuration files and setup instructions`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a test automation specialist for ${language}` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async analyzeCoverage(code: string, language: string): Promise<string> {
    const prompt = `Analyze test coverage for this ${language} code and provide improvement plan:

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze:
1. Current coverage gaps
2. Untested code paths
3. Missing edge cases
4. Untested error handling
5. Recommendations for improvement

Provide:
1. Coverage analysis summary
2. Priority for new tests
3. Specific test cases to add
4. Estimated coverage improvement`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a code coverage analysis expert for ${language}` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private getTestFramework(language: string): string {
    const frameworks: Record<string, string> = {
      typescript: 'Jest/Vitest',
      javascript: 'Jest/Mocha',
      python: 'pytest/unittest',
      java: 'JUnit 5/Mockito',
      csharp: 'xUnit/NUnit',
      go: 'testing/testify',
      rust: 'cargo test',
      php: 'PHPUnit/Pest',
      ruby: 'RSpec/Minitest',
    };
    return frameworks[language] || 'Jest';
  }

  private getExtension(language: string): string {
    const extensions: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
    };
    return extensions[language] || 'js';
  }

  private getTestFileExtension(language: string): string {
    return this.getExtension(language);
  }

  private generateUnitTestTemplate(component: string, language: string): string {
    return `// Unit tests for ${component}`;
  }

  private generateMockStrategy(component: string, language: string): string {
    return `Mock all external dependencies like APIs, databases, and file systems.`;
  }

  private identifyIntegrationPoints(component: string): string {
    return `- External APIs\n- Database connections\n- File system\n- Event emitters`;
  }

  private async setupTestAutomation(language: string, coverage?: number): Promise<string> {
    const testFramework = this.getTestFramework(language);
    const prompt = `Setup automated testing for ${language} project using ${testFramework}:

Provide:
1. Test runner configuration
2. Coverage configuration (target: ${coverage || 80}%)
3. CI/CD pipeline setup
4. Code coverage reports
5. Test organization structure
6. Mock/stub strategy
7. Test data management
8. Performance testing setup

Format as configuration files and setup instructions`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a test automation specialist for ${language}` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }
}

export default TestingAgent;
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - run: npx playwright install
    - run: npm run test:e2e
\`\`\``;
  }

  private async setupTestAutomation(language: string, coverage?: number): Promise<string> {
    const coverageTarget = coverage || 80;

    return `Test Automation Setup for ${language}

🎯 Coverage Target: ${coverageTarget}%

Testing Stack:
${this.getTestingStack(language)}

Configuration Files:

1. **Test Configuration** (\`jest.config.js\` or equivalent):
\`\`\`javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.js',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: ${coverageTarget},
      functions: ${coverageTarget},
      lines: ${coverageTarget},
      statements: ${coverageTarget}
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ]
};
\`\`\`

2. **Test Scripts** (\`package.json\`):
\`\`\`json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
\`\`\`

3. **Pre-commit Hooks** (\`.husky/pre-commit\`):
\`\`\`bash
#!/bin/bash
npm run test:ci
npm run lint
npm run build
\`\`\`

Quality Gates:
- ✅ All tests pass
- ✅ Coverage meets threshold
- ✅ No linting errors
- ✅ Build succeeds
- ✅ Security scan passes

Test Reporting:
- JUnit XML for CI/CD
- HTML coverage reports
- Test execution metrics
- Performance benchmarks

Parallel Execution:
\`\`\`javascript
// jest.config.js
module.exports = {
  maxWorkers: '50%', // Use 50% of available cores
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
\`\`\`

Test Data Management:
- Factory pattern for test data
- Database seeding for integration tests
- API mocking for external dependencies
- Screenshot comparison for visual tests`;
  }

  private getTestFramework(language: string): string {
    const frameworks = {
      typescript: 'Jest + React Testing Library',
      javascript: 'Jest + React Testing Library',
      python: 'pytest + unittest.mock',
      java: 'JUnit 5 + Mockito',
      csharp: 'xUnit + Moq',
      go: 'testing + testify'
    };
    return frameworks[language as keyof typeof frameworks] || 'Jest';
  }

  private getTestFileExtension(language: string): string {
    const extensions = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      go: 'go'
    };
    return extensions[language as keyof typeof extensions] || 'ts';
  }

  private generateUnitTestTemplate(component: string, language: string): string {
    if (language === 'typescript' || language === 'javascript') {
      return `import { render, screen, fireEvent } from '@testing-library/react';
import { ${component} } from '../${component}';

describe('${component}', () => {
  test('renders correctly', () => {
    render(<${component} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    render(<${component} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });

  test('handles error states', () => {
    render(<${component} error={new Error('Test error')} />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  test('performs async operations', async () => {
    render(<${component} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(await screen.findByText('Data loaded')).toBeInTheDocument();
  });
});`;
    }

    return `// Unit test template for ${language}
// Implementation depends on specific testing framework`;
  }

  private generateMockStrategy(component: string, language: string): string {
    if (language === 'typescript' || language === 'javascript') {
      return `- API calls: Mock Service Worker (MSW)
- External dependencies: jest.mock()
- React components: React Testing Library
- Custom hooks: jest.mock() with manual mock implementations
- Context providers: Render with context wrapper`;
    }

    return `- Use appropriate mocking framework for ${language}
- Mock external dependencies
- Stub complex computations
- Fake network responses`;
  }

  private identifyIntegrationPoints(component: string): string {
    return `- API endpoints (${component} communicates with)
- Database connections (${component} data persistence)
- External services (${component} third-party integrations)
- File system (${component} I/O operations)
- Other components (${component} internal dependencies)`;
  }

  private getTestingStack(language: string): string {
    const stacks = {
      typescript: `- Jest (Test runner & assertion library)
- React Testing Library (Component testing)
- Playwright (E2E testing)
- MSW (API mocking)
- Testing Library Jest DOM (DOM assertions)`,
      javascript: `- Jest (Test runner & assertion library)
- React Testing Library (Component testing)
- Playwright (E2E testing)
- MSW (API mocking)
- Testing Library Jest DOM (DOM assertions)`,
      python: `- pytest (Test framework)
- pytest-cov (Coverage reporting)
- responses (HTTP mocking)
- factory-boy (Test data generation)
- selenium (E2E testing)`,
      java: `- JUnit 5 (Test framework)
- Mockito (Mocking)
- AssertJ (Assertions)
- Testcontainers (Integration testing)
- Selenium (E2E testing)`,
      csharp: `- xUnit (Test framework)
- Moq (Mocking)
- FluentAssertions (Assertions)
- SpecFlow (BDD testing)
- Selenium (E2E testing)`,
      go: `- testing (Standard library)
- testify (Assertions & mocking)
- ginkgo (BDD framework)
- gomega (Matchers)
- selenium (E2E testing)`
    };

    return stacks[language as keyof typeof stacks] || '- Jest\n- React Testing Library\n- Playwright';
  }
}

export default TestingAgent;