/**
 * Knowledge Base for agents
 * Contains language-specific knowledge, best practices, patterns, APIs
 */

export interface LanguageInfo {
  name: string;
  aliases: string[];
  extensions: string[];
  packageManager: string;
  runtime: string;
  frameworks: string[];
  testFrameworks: string[];
  linters: string[];
  bestPractices: string[];
}

export interface KnowledgeBase {
  languages: Map<string, LanguageInfo>;
  patterns: Map<string, string>;
  apis: Map<string, string[]>;
}

/**
 * Language knowledge database
 */
export const LanguageDatabase: Record<string, LanguageInfo> = {
  typescript: {
    name: 'TypeScript',
    aliases: ['ts'],
    extensions: ['.ts', '.tsx'],
    packageManager: 'npm/yarn/pnpm',
    runtime: 'Node.js, Browser, Deno, Bun',
    frameworks: [
      'React',
      'Next.js',
      'Express',
      'NestJS',
      'Svelte',
      'Vue',
      'Angular',
      'Remix',
      'SolidJS',
    ],
    testFrameworks: ['Jest', 'Vitest', 'Mocha', 'Cypress', 'Playwright'],
    linters: ['ESLint', 'Prettier', 'TypeScript Compiler'],
    bestPractices: [
      'Use strict mode',
      'Proper type annotations',
      'Use interfaces over types for object shapes',
      'Avoid any type',
      'Use const by default',
      'Immutability where possible',
      'Proper error handling',
    ],
  },
  python: {
    name: 'Python',
    aliases: ['py'],
    extensions: ['.py'],
    packageManager: 'pip/poetry/pipenv',
    runtime: 'CPython, PyPy, Anaconda',
    frameworks: [
      'Django',
      'Flask',
      'FastAPI',
      'Pyramid',
      'Tornado',
      'SQLAlchemy',
      'Pandas',
      'NumPy',
    ],
    testFrameworks: ['pytest', 'unittest', 'nose', 'testify'],
    linters: ['pylint', 'flake8', 'black', 'mypy'],
    bestPractices: [
      'Follow PEP 8',
      'Use virtual environments',
      'Type hints (Python 3.5+)',
      'Proper exception handling',
      'DRY principle',
      'Single responsibility',
      'Use f-strings',
    ],
  },
  go: {
    name: 'Go',
    aliases: ['golang'],
    extensions: ['.go'],
    packageManager: 'go modules',
    runtime: 'Go runtime (compiled)',
    frameworks: ['Gin', 'Echo', 'Beego', 'GORM', 'Chi', 'Fiber'],
    testFrameworks: ['testing', 'testify', 'GoConvey'],
    linters: ['golangci-lint', 'gofmt', 'vet'],
    bestPractices: [
      'Explicit error handling',
      'No exceptions use errors',
      'interfaces for abstraction',
      'Goroutines for concurrency',
      'Code generation',
      'Fast compilation',
      'Simplicity over cleverness',
    ],
  },
  rust: {
    name: 'Rust',
    aliases: ['rs'],
    extensions: ['.rs'],
    packageManager: 'Cargo',
    runtime: 'Rust runtime (compiled)',
    frameworks: ['Actix', 'Rocket', 'Axum', 'Tokio', 'Tauri', 'Wasm'],
    testFrameworks: ['cargo test', 'criterion', 'proptest'],
    linters: ['clippy', 'rustfmt', 'cargo-deny'],
    bestPractices: [
      'Ownership and borrowing',
      'Trait-based design',
      'Pattern matching',
      'Error types (Result/Option)',
      'Memory safety',
      'Zero-cost abstractions',
      'Fearless concurrency',
    ],
  },
  java: {
    name: 'Java',
    aliases: ['java'],
    extensions: ['.java', '.kt'],
    packageManager: 'Maven/Gradle',
    runtime: 'JVM',
    frameworks: [
      'Spring Boot',
      'Quarkus',
      'Micronaut',
      'Play Framework',
      'Akka',
      'Vert.x',
    ],
    testFrameworks: ['JUnit', 'TestNG', 'Mockito', 'AssertJ'],
    linters: ['Checkstyle', 'SpotBugs', 'SonarQube'],
    bestPractices: [
      'SOLID principles',
      'Design patterns',
      'Null checking',
      'Exception handling',
      'Immutability',
      'Use streams',
      'Dependency injection',
    ],
  },
  csharp: {
    name: 'C#',
    aliases: ['cs', 'dotnet'],
    extensions: ['.cs'],
    packageManager: 'NuGet',
    runtime: '.NET (Core, Framework, Mono)',
    frameworks: ['ASP.NET Core', 'Entity Framework', 'WPF', 'Blazor', 'Xamarin'],
    testFrameworks: ['xUnit', 'NUnit', 'MSTest', 'Moq'],
    linters: ['StyleCop', 'Roslyn Analyzers', 'SonarQube'],
    bestPractices: [
      'C# naming conventions',
      'LINQ for queries',
      'Async/await',
      'Nullable reference types',
      'Dependency injection',
      'Property accessors',
      'Use tuples',
    ],
  },
  javascript: {
    name: 'JavaScript',
    aliases: ['js'],
    extensions: ['.js', '.jsx', '.mjs'],
    packageManager: 'npm/yarn',
    runtime: 'Browser, Node.js, Deno, Bun',
    frameworks: ['React', 'Vue', 'Angular', 'Svelte', 'Express', 'Next.js'],
    testFrameworks: ['Jest', 'Mocha', 'Jasmine', 'Vitest'],
    linters: ['ESLint', 'Prettier', 'JSHint'],
    bestPractices: [
      'Const by default',
      'Avoid global scope',
      'Promises/async-await',
      'Error handling',
      'Module pattern',
      'Event delegation',
      'Avoid callback hell',
    ],
  },
  php: {
    name: 'PHP',
    aliases: ['php'],
    extensions: ['.php'],
    packageManager: 'Composer',
    runtime: 'PHP CLI/FPM',
    frameworks: ['Laravel', 'Symfony', 'Slim', 'Yii', 'CakePHP', 'Doctrine'],
    testFrameworks: ['PHPUnit', 'Pest', 'Behat'],
    linters: ['PHP_CodeSniffer', 'PHPStan', 'Psalm'],
    bestPractices: [
      'PSR standards',
      'Type hints',
      'Dependency injection',
      'OOP principles',
      'Error handling',
      'SQL injection prevention',
      'Use namespaces',
    ],
  },
  ruby: {
    name: 'Ruby',
    aliases: ['rb'],
    extensions: ['.rb'],
    packageManager: 'Bundler',
    runtime: 'Ruby runtime (MRI, JRuby, TruffleRuby)',
    frameworks: ['Rails', 'Sinatra', 'Hanami', 'Rack', 'Puma'],
    testFrameworks: ['RSpec', 'Minitest', 'Cucumber'],
    linters: ['RuboCop', 'Reek', 'Brakeman'],
    bestPractices: [
      'Ruby style guide',
      'Conventions over configuration',
      'DRY principle',
      'Blocks and iterators',
      'Monkey patching (careful)',
      'Gems for reusability',
      'Convention-based naming',
    ],
  },
};

/**
 * Design Patterns Knowledge
 */
export const DesignPatterns: Record<string, string> = {
  'Model-View-Controller': `Separates app into Model (data), View (UI), Controller (logic).
Use when: Building web apps with UI and business logic separation.`,

  'Model-View-ViewModel': `Similar to MVC but with ViewModel for state management.
Use when: Building data-binding heavy UIs (WPF, Xamarin).`,

  'Repository': `Abstract data access layer behind interfaces.
Use when: Need to switch data sources without changing business logic.`,

  'Dependency Injection':
    `Pass dependencies into objects rather than creating them.
Use when: Need loose coupling and testability.`,

  'Factory':
    `Create objects without specifying exact classes.
Use when: Creation logic is complex or varies.`,

  'Strategy':
    `Encapsulate interchangeable algorithms in objects.
Use when: Need to switch algorithms at runtime.`,

  'Observer': `One-to-many notification of state changes.
Use when: Need reactive updates (events, pub/sub).`,

  'Singleton': `Ensure only one instance exists globally.
Use when: Need single point of access (but prefer DI).`,
};

/**
 * Best Practices by Category
 */
export const BestPractices: Record<string, string[]> = {
  security: [
    'Validate all user inputs',
    'Use parameterized queries',
    'Hash passwords with salt',
    'Use HTTPS/TLS',
    'Implement CSRF protection',
    'Use security headers',
    'Keep dependencies updated',
    'Principle of least privilege',
    'Encrypt sensitive data',
    'Log security events',
  ],
  performance: [
    'Profile before optimizing',
    'Cache strategically',
    'Lazy load resources',
    'Minimize network requests',
    'Optimize images',
    'Use CDNs for static assets',
    'Enable compression',
    'Monitor database queries',
    'Async operations',
    'Connection pooling',
  ],
  testing: [
    'Test behavior, not implementation',
    'Aim for 70-80% coverage',
    'Test edge cases',
    'Mock external dependencies',
    'Fast unit tests',
    'Integration tests',
    'End-to-end tests',
    'Automated testing in CI/CD',
    'Performance testing',
    'Security testing',
  ],
  code: [
    'SOLID principles',
    'DRY (Don\'t Repeat Yourself)',
    'KISS (Keep It Simple)',
    'Clear naming',
    'Single responsibility',
    'Comment why, not what',
    'Consistent style',
    'Proper error handling',
    'Modularity',
    'Version control usage',
  ],
};

/**
 * Agent Knowledge Base Manager
 */
export class AgentKnowledge {
  static getLanguageInfo(language: string): LanguageInfo | null {
    const key = Object.keys(LanguageDatabase).find(
      (k) =>
        k.toLowerCase() === language.toLowerCase() ||
        LanguageDatabase[k as keyof typeof LanguageDatabase].aliases.includes(
          language.toLowerCase()
        )
    );
    return key ? (LanguageDatabase[key as keyof typeof LanguageDatabase] as LanguageInfo) : null;
  }

  static getFrameworksForLanguage(language: string): string[] {
    const info = this.getLanguageInfo(language);
    return info?.frameworks || [];
  }

  static getTestFrameworksForLanguage(language: string): string[] {
    const info = this.getLanguageInfo(language);
    return info?.testFrameworks || [];
  }

  static getLintersForLanguage(language: string): string[] {
    const info = this.getLanguageInfo(language);
    return info?.linters || [];
  }

  static getBestPracticesForLanguage(language: string): string[] {
    const info = this.getLanguageInfo(language);
    return info?.bestPractices || [];
  }

  static getAllLanguages(): string[] {
    return Object.keys(LanguageDatabase);
  }

  static getPattern(patternName: string): string | null {
    return DesignPatterns[patternName] || null;
  }

  static getAllPatterns(): string[] {
    return Object.keys(DesignPatterns);
  }

  static getSecurityPractices(): string[] {
    return BestPractices.security;
  }

  static getPerformancePractices(): string[] {
    return BestPractices.performance;
  }

  static getTestingPractices(): string[] {
    return BestPractices.testing;
  }

  static getCodePractices(): string[] {
    return BestPractices.code;
  }
}

export default AgentKnowledge;
