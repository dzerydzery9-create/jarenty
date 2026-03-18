import BaseAgent, { AgentConfig, AgentTask, AgentResult } from './BaseAgent';

class DocumentationAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Documentation Agent',
      description: 'Creates comprehensive documentation, API references, and user guides',
      capabilities: ['api-documentation', 'user-guides', 'code-documentation', 'architecture-docs'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'markdown'],
    };
    super(config);
  }

  canHandle(task: AgentTask): boolean {
    return ['api-documentation', 'user-guides', 'code-documentation', 'architecture-docs'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { component, language, audience, format } = task.input;

    let result = '';

    switch (task.type) {
      case 'api-documentation':
        result = await this.createAPIDocs(component, language);
        break;
      case 'user-guides':
        result = await this.createUserGuides(component, audience);
        break;
      case 'code-documentation':
        result = await this.createCodeDocs(component, language);
        break;
      case 'architecture-docs':
        result = await this.createArchitectureDocs(component);
        break;
    }

    return {
      taskId: task.id,
      success: true,
      output: result,
      files: {},
    };
  }

  private async createAPIDocs(component: string, language: string): Promise<string> {
    return `# ${component} API Documentation

## Overview

${component} provides a comprehensive API for ${this.getComponentPurpose(component)}.

## Authentication

\`\`\`${language}
// Initialize client
const client = new ${component}Client({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com'
});
\`\`\`

## Core Endpoints

### GET /api/v1/${component.toLowerCase()}

Retrieve ${component.toLowerCase()} information.

**Parameters:**
- \`id\` (string, required): The ${component.toLowerCase()} identifier
- \`include\` (array, optional): Related resources to include

**Response:**
\`\`\`json
{
  "id": "123",
  "name": "${component}",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
\`\`\`

**Example:**
\`\`\`${language}
const ${component.toLowerCase()} = await client.get${component}('123');
console.log(${component.toLowerCase()}.name); // "${component}"
\`\`\`

### POST /api/v1/${component.toLowerCase()}

Create a new ${component.toLowerCase()}.

**Request Body:**
\`\`\`json
{
  "name": "New ${component}",
  "description": "Description of the new ${component}",
  "settings": {}
}
\`\`\`

**Response:** Same as GET endpoint

### PUT /api/v1/${component.toLowerCase()}/{id}

Update an existing ${component.toLowerCase()}.

**Request Body:** Same as POST, all fields optional

### DELETE /api/v1/${component.toLowerCase()}/{id}

Delete a ${component.toLowerCase()}.

## Error Handling

All API errors follow this format:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "name",
      "issue": "required"
    }
  }
}
\`\`\`

## Rate Limiting

- 1000 requests per hour for free tier
- 10000 requests per hour for paid tier
- Rate limit headers included in all responses

## SDKs and Libraries

### JavaScript/TypeScript
\`\`\`bash
npm install @company/${component.toLowerCase()}-sdk
\`\`\`

### Python
\`\`\`bash
pip install ${component.toLowerCase()}-sdk
\`\`\`

### Java
\`\`\`xml
<dependency>
  <groupId>com.company</groupId>
  <artifactId>${component.toLowerCase()}-sdk</artifactId>
  <version>1.0.0</version>
</dependency>
\`\`\`

## Webhooks

Subscribe to ${component} events:

\`\`\`json
{
  "url": "https://your-app.com/webhooks",
  "events": ["${component.toLowerCase()}.created", "${component.toLowerCase()}.updated"],
  "secret": "your-webhook-secret"
}
\`\`\`

## Changelog

### v1.0.0 (Current)
- Initial release
- Basic CRUD operations
- Authentication support
- Webhook integration

## Support

- 📧 Email: support@company.com
- 💬 Discord: https://discord.gg/company
- 📚 Documentation: https://docs.company.com
- 🐛 Bug Reports: https://github.com/company/${component}/issues`;
  }

  private async createUserGuides(component: string, audience?: string): Promise<string> {
    const audienceType = audience || 'developers';

    return `# ${component} User Guide

## Welcome

Welcome to ${component}! This guide will help you get started with ${this.getAudienceDescription(audienceType)}.

## Quick Start

### 1. Installation

\`\`\`bash
# Using npm
npm install ${component.toLowerCase()}

# Using yarn
yarn add ${component.toLowerCase()}

# Using pnpm
pnpm add ${component.toLowerCase()}
\`\`\`

### 2. Basic Usage

\`\`\`javascript
import { ${component} } from '${component.toLowerCase()}';

// Create instance
const app = new ${component}({
  theme: 'dark',
  language: 'en'
});

// Start the application
app.start();
\`\`\`

### 3. Configuration

Create a configuration file:

\`\`\`json
{
  "theme": "dark",
  "language": "en",
  "features": {
    "ai": true,
    "terminal": true,
    "plugins": true
  },
  "models": {
    "default": "deepseek-coder:1.3b",
    "fallback": "gemma3:270m"
  }
}
\`\`\`

## Core Features

### AI Integration

${component} integrates with multiple AI models:

- **DeepSeek Coder**: Best for code generation
- **Gemma 3**: Lightweight and fast
- **Custom Models**: Add your own Ollama models

\`\`\`javascript
// Switch models
app.setModel('deepseek-coder:1.3b');

// Chat with AI
const response = await app.chat('Explain this code...');
\`\`\`

### Terminal Operations

Execute commands directly in the integrated terminal:

\`\`\`javascript
// Run a command
const result = await app.terminal.execute('npm install');

// Get output
console.log(result.output);
\`\`\`

### Plugin System

Extend ${component} with plugins:

\`\`\`javascript
// Install a plugin
await app.plugins.install('git-integration');

// Use plugin features
const git = app.plugins.get('git-integration');
await git.commit('Initial commit');
\`\`\`

## Advanced Usage

### Custom Themes

Create your own theme:

\`\`\`css
.${component.toLowerCase()}-theme-custom {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --background-color: #2d3436;
  --text-color: #ffffff;
}
\`\`\`

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+Shift+P\` | Command Palette |
| \`Ctrl+B\` | Toggle Sidebar |
| \`Ctrl+J\` | Toggle Terminal |
| \`Ctrl+K\` | Clear Terminal |
| \`F1\` | Show Help |

### Workspace Management

\`\`\`javascript
// Create workspace
const workspace = await app.workspaces.create('my-project');

// Add files
await workspace.addFile('src/main.js', 'console.log("Hello!");');

// Save workspace
await workspace.save();
\`\`\`

## Troubleshooting

### Common Issues

#### Application won't start
\`\`\`bash
# Check Node.js version
node --version

# Clear cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install
\`\`\`

#### AI models not working
\`\`\`bash
# Check Ollama status
ollama list

# Pull required models
ollama pull deepseek-coder:1.3b
ollama pull gemma3:270m
\`\`\`

#### Plugins not loading
\`\`\`bash
# Check plugin directory
ls -la ~/.${component.toLowerCase()}/plugins/

# Reinstall plugins
app.plugins.reinstallAll();
\`\`\`

### Performance Optimization

1. **Memory Management**
   - Limit Ollama memory to 5GB
   - Close unused tabs
   - Clear terminal history

2. **Startup Time**
   - Disable unused plugins
   - Use lightweight themes
   - Pre-load frequently used models

## Best Practices

### Code Organization
\`\`\`javascript
// Good: Organized structure
src/
  components/
  services/
  utils/
  plugins/

// Bad: Everything in one file
src/
  app.js (5000+ lines)
\`\`\`

### Error Handling
\`\`\`javascript
// Good: Proper error handling
try {
  await app.start();
} catch (error) {
  console.error('Failed to start:', error);
  app.showErrorDialog(error);
}

// Bad: Silent failures
app.start();
\`\`\`

### Security
- Never commit API keys
- Use environment variables
- Validate all inputs
- Keep dependencies updated

## API Reference

See [API Documentation](./api.md) for detailed API reference.

## Contributing

We welcome contributions! See [Contributing Guide](./contributing.md).

## License

${component} is licensed under the MIT License. See [LICENSE](./license.md) for details.

---

*Last updated: ${new Date().toISOString().split('T')[0]}*`;
  }

  private async createCodeDocs(component: string, language: string): Promise<string> {
    return `## ${component} Code Documentation

### Class Overview

\`\`\`${language}
/**
 * ${component} - ${this.getComponentDescription(component)}
 *
 * This class provides the core functionality for ${component.toLowerCase()} operations
 * including initialization, configuration, and lifecycle management.
 *
 * @example
 * \`\`\`${language}
 * const instance = new ${component}({
 *   config: 'default'
 * });
 * await instance.initialize();
 * \`\`\`
 */
export class ${component} {
  /**
   * Creates a new ${component} instance
   * @param options Configuration options
   */
  constructor(options: ${component}Options = {}) {
    // Implementation
  }

  /**
   * Initializes the ${component} instance
   * @returns Promise that resolves when initialization is complete
   * @throws {InitializationError} When initialization fails
   */
  async initialize(): Promise<void> {
    // Implementation
  }

  /**
   * Destroys the ${component} instance and cleans up resources
   * @returns Promise that resolves when cleanup is complete
   */
  async destroy(): Promise<void> {
    // Implementation
  }
}
\`\`\`

### Methods

#### \`initialize()\`

Initializes the ${component} with default settings and establishes necessary connections.

**Parameters:** None

**Returns:** \`Promise<void>\`

**Throws:**
- \`NetworkError\` - When connection to required services fails
- \`ConfigurationError\` - When invalid configuration is provided

**Example:**
\`\`\`${language}
try {
  await component.initialize();
  console.log('Initialization successful');
} catch (error) {
  console.error('Initialization failed:', error.message);
}
\`\`\`

#### \`destroy()\`

Cleans up resources and shuts down the ${component}.

**Parameters:** None

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`${language}
await component.destroy();
console.log('Component destroyed');
\`\`\`

### Properties

#### \`isInitialized\`

Indicates whether the component has been initialized.

**Type:** \`boolean\`

**Default:** \`false\`

**Example:**
\`\`\`${language}
if (component.isInitialized) {
  // Component is ready to use
}
\`\`\`

### Events

#### \`'ready'\`

Emitted when the component is fully initialized and ready to use.

**Parameters:**
- \`component\` - The initialized component instance

**Example:**
\`\`\`${language}
component.on('ready', (instance) => {
  console.log('Component ready:', instance);
});
\`\`\`

#### \`'error'\`

Emitted when an error occurs during operation.

**Parameters:**
- \`error\` - The error that occurred

**Example:**
\`\`\`${language}
component.on('error', (error) => {
  console.error('Component error:', error);
});
\`\`\`

### Type Definitions

\`\`\`${language}
/**
 * Configuration options for ${component}
 */
export interface ${component}Options {
  /** Enable debug logging */
  debug?: boolean;
  /** Timeout for operations in milliseconds */
  timeout?: number;
  /** Custom configuration object */
  config?: Record<string, any>;
}

/**
 * Error thrown when ${component} initialization fails
 */
export class InitializationError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'InitializationError';
  }
}
\`\`\`

### Usage Examples

#### Basic Usage

\`\`\`${language}
import { ${component} } from '${component.toLowerCase()}';

const component = new ${component}({
  debug: true,
  timeout: 5000
});

await component.initialize();

// Use component
await component.doSomething();

// Cleanup
await component.destroy();
\`\`\`

#### Advanced Configuration

\`\`\`${language}
const component = new ${component}({
  config: {
    retries: 3,
    backoff: 'exponential',
    customSetting: 'value'
  }
});
\`\`\`

#### Error Handling

\`\`\`${language}
try {
  await component.initialize();
} catch (error) {
  if (error instanceof InitializationError) {
    // Handle initialization error
    console.error('Failed to initialize:', error.cause);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
\`\`\`

### Testing

\`\`\`${language}
import { ${component} } from '${component.toLowerCase()}';

describe('${component}', () => {
  let component: ${component};

  beforeEach(() => {
    component = new ${component}();
  });

  afterEach(async () => {
    await component.destroy();
  });

  it('should initialize successfully', async () => {
    await expect(component.initialize()).resolves.toBeUndefined();
    expect(component.isInitialized).toBe(true);
  });
});
\`\`\`

### Dependencies

- **Runtime Dependencies:**
  - \`axios\` - HTTP client
  - \`lodash\` - Utility functions

- **Development Dependencies:**
  - \`@types/node\` - TypeScript definitions
  - \`jest\` - Testing framework

### Changelog

#### v1.0.0
- Initial release
- Basic functionality implemented
- Error handling added

#### v0.9.0
- Beta release
- Core features implemented
- API stabilization`;
  }

  private async createArchitectureDocs(component: string): Promise<string> {
    return `# ${component} Architecture Documentation

## System Overview

${component} is a comprehensive AI-powered development environment built with modern web technologies. The system follows a modular architecture with clear separation of concerns and extensible plugin system.

## Architecture Principles

### 1. Modularity
- **Plugin System**: Extensible architecture allowing third-party plugins
- **Service Layer**: Business logic separated from UI components
- **Configuration Management**: Centralized configuration with environment-specific overrides

### 2. Performance
- **Lazy Loading**: Components and plugins loaded on-demand
- **Memory Management**: Efficient resource usage with automatic cleanup
- **Caching Strategy**: Multi-level caching for improved performance

### 3. Reliability
- **Error Boundaries**: Graceful error handling at component level
- **Fallback Mechanisms**: Automatic fallback for failed operations
- **Health Monitoring**: Built-in monitoring and diagnostics

## System Components

### Core Components

\`\`\`mermaid
graph TB
    A[UI Layer] --> B[Service Layer]
    B --> C[Data Layer]
    A --> D[Plugin System]
    D --> B
    B --> E[External APIs]
\`\`\`

#### UI Layer
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **State Management**: Zustand for global state
- **Components**: Modular component architecture

#### Service Layer
- **API Client**: Axios-based HTTP client with interceptors
- **Business Logic**: Pure functions for data processing
- **Validation**: Schema-based input validation
- **Caching**: In-memory and persistent caching

#### Data Layer
- **Storage**: IndexedDB for client-side persistence
- **Synchronization**: Real-time data synchronization
- **Backup**: Automatic backup and restore
- **Migration**: Schema migration system

#### Plugin System
- **Plugin API**: Well-defined interfaces for plugin development
- **Lifecycle Management**: Plugin activation/deactivation
- **Security**: Sandboxed plugin execution
- **Updates**: Automatic plugin updates

### Data Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Component
    participant S as Service
    participant P as Plugin
    participant A as API

    U->>UI: User Action
    UI->>S: Service Call
    S->>P: Plugin Hook
    P->>A: API Request
    A-->>P: API Response
    P-->>S: Processed Data
    S-->>UI: Result
    UI-->>U: UI Update
\`\`\`

## Component Architecture

### File Structure

\`\`\`
src/
├── components/          # UI Components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── services/           # Business logic services
│   ├── api/           # API client services
│   ├── storage/       # Data storage services
│   └── plugins/       # Plugin management
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── constants/         # Application constants
└── plugins/           # Built-in plugins
\`\`\`

### Component Patterns

#### Container/Presentational Pattern

\`\`\`typescript
// Container component (business logic)
const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const sendMessage = useCallback(async (text: string) => {
    // Business logic here
  }, []);

  return <Chat messages={messages} onSend={sendMessage} />;
};

// Presentational component (UI only)
const Chat: React.FC<ChatProps> = ({ messages, onSend }) => {
  return (
    <div className="chat">
      {/* UI rendering */}
    </div>
  );
};
\`\`\`

#### Custom Hook Pattern

\`\`\`typescript
const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const response = await api.sendMessage(text);
      setMessages(prev => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
};
\`\`\`

## State Management

### Global State Structure

\`\`\`typescript
interface AppState {
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    activePanel: string;
  };
  user: {
    preferences: UserPreferences;
    session: SessionData;
  };
  workspace: {
    current: Workspace;
    recent: Workspace[];
  };
  plugins: {
    installed: Plugin[];
    active: string[];
  };
}
\`\`\`

### State Updates

\`\`\`typescript
// Using Zustand store
const useAppStore = create<AppState>((set, get) => ({
  // State definition
  ui: { theme: 'dark', sidebarOpen: true, activePanel: 'chat' },

  // Actions
  toggleSidebar: () =>
    set(state => ({ ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } })),

  setActivePanel: (panel: string) =>
    set(state => ({ ui: { ...state.ui, activePanel: panel } })),
}));
\`\`\`

## Plugin Architecture

### Plugin Interface

\`\`\`typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;

  // Lifecycle methods
  activate(context: PluginContext): void;
  deactivate(): void;

  // Plugin-specific methods
  getCommands(): Command[];
  getViews(): View[];
  getSettings(): Setting[];
}
\`\`\`

### Plugin Context

\`\`\`typescript
interface PluginContext {
  // Core services
  workspace: WorkspaceService;
  ui: UIService;
  storage: StorageService;

  // Plugin APIs
  commands: CommandRegistry;
  views: ViewRegistry;
  settings: SettingsRegistry;

  // Utilities
  logger: Logger;
  notifications: NotificationService;
}
\`\`\`

## Security Architecture

### Authentication & Authorization

\`\`\`typescript
interface AuthService {
  login(credentials: Credentials): Promise<Session>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
}
\`\`\`

### Data Protection

- **Encryption**: AES-256 for sensitive data
- **HTTPS Only**: All external communications
- **CSP Headers**: Content Security Policy
- **Input Validation**: Schema-based validation
- **XSS Protection**: Sanitization of user inputs

## Performance Optimization

### Bundle Optimization

\`\`\`javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        ui: {
          test: /[\\/]components[\\/]/,
          name: 'ui',
          chunks: 'all',
        },
      },
    },
  },
};
\`\`\`

### Lazy Loading

\`\`\`typescript
const ChatPanel = lazy(() => import('./components/ChatPanel'));
const TerminalPanel = lazy(() => import('./components/TerminalPanel'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <ChatPanel />
</Suspense>
\`\`\`

## Deployment Architecture

### Development Environment

\`\`\`yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
\`\`\`

### Production Environment

\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: ${component.toLowerCase()}:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
\`\`\`

## Monitoring & Observability

### Logging Strategy

\`\`\`typescript
interface Logger {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
}

// Usage
logger.info('User logged in', { userId, timestamp });
logger.error('API request failed', { error, url, method });
\`\`\`

### Metrics Collection

- **Performance Metrics**: Page load times, API response times
- **Usage Metrics**: Feature usage, user flows
- **Error Metrics**: Error rates, error types
- **Business Metrics**: Conversion rates, user engagement

## Testing Strategy

### Testing Pyramid

\`\`\`mermaid
graph TD
    A[Unit Tests] --> B[Integration Tests]
    B --> C[E2E Tests]
    C --> D[Manual Testing]

    A --> E[80% Coverage]
    B --> F[15% Coverage]
    C --> G[5% Coverage]
\`\`\`

### Test Categories

#### Unit Tests
- Component logic
- Utility functions
- Service methods
- Plugin functionality

#### Integration Tests
- API integrations
- Component interactions
- Plugin communications
- Data flow validation

#### E2E Tests
- User workflows
- Critical user journeys
- Cross-browser compatibility
- Performance validation

## Migration & Versioning

### API Versioning

\`\`\`typescript
// Versioned API endpoints
const API_VERSIONS = {
  v1: '/api/v1',
  v2: '/api/v2',
} as const;

// Usage
const endpoint = \`\${API_VERSIONS.v1}/users\`;
\`\`\`

### Data Migration

\`\`\`typescript
interface Migration {
  version: string;
  up: (data: any) => Promise<any>;
  down: (data: any) => Promise<any>;
}

const migrations: Migration[] = [
  {
    version: '1.0.0',
    up: async (data) => {
      // Migration logic
      return migratedData;
    },
    down: async (data) => {
      // Rollback logic
      return originalData;
    },
  },
];
\`\`\`

## Future Considerations

### Scalability
- Microservices architecture
- Horizontal scaling
- CDN integration
- Database sharding

### Extensibility
- Plugin marketplace
- Theme system
- Localization support
- Third-party integrations

### Maintainability
- Automated testing
- Code quality gates
- Documentation automation
- Performance monitoring`;
  }

  private getComponentPurpose(component: string): string {
    const purposes = {
      'AI': 'artificial intelligence model management and integration',
      'Terminal': 'command-line interface and system operations',
      'Plugin': 'extensible plugin system for custom functionality',
      'FileSystem': 'file and directory operations',
      'UI': 'user interface and user experience management'
    };
    return purposes[component as keyof typeof purposes] || `${component.toLowerCase()} functionality`;
  }

  private getAudienceDescription(audience: string): string {
    const descriptions = {
      'developers': 'developing applications with this powerful tool',
      'users': 'using this application for your daily tasks',
      'administrators': 'managing and deploying this system',
      'testers': 'testing and validating functionality'
    };
    return descriptions[audience as keyof typeof descriptions] || 'working with this system';
  }

  private getComponentDescription(component: string): string {
    const descriptions = {
      'AI': 'Handles AI model integration and conversation management',
      'Terminal': 'Provides command-line interface capabilities',
      'Plugin': 'Manages plugin lifecycle and communication',
      'FileSystem': 'Handles file and directory operations',
      'UI': 'Manages user interface state and interactions'
    };
    return descriptions[component as keyof typeof descriptions] || `Provides ${component.toLowerCase()} functionality`;
  }
}

export default DocumentationAgent;