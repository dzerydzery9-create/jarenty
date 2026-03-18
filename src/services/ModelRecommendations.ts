// Recommended models for different use cases
// ⚠️  SYSTEM RAM: 7.6GB - Only models < 3GB recommended!

export const RECOMMENDED_MODELS = {
  'deepseek-coder': {
    name: 'deepseek-coder:1.3b',
    size: '1.3GB',
    speed: '⚡⚡⚡ Very Fast',
    description: 'Code generation & completion - Optimized for programming',
    tags: ['code-gen', 'lightweight', 'fast'],
    warning: null,
  },
  'mistral': {
    name: 'mistral:7b',
    size: '7GB',
    speed: '⚡⚡ Fast',
    description: '❌ NOT SAFE - Will freeze system (7.6GB RAM available)',
    tags: ['general', 'versatile', 'medium-speed'],
    warning: '⚠️  TOO LARGE FOR 7.6GB RAM! System will freeze. Skip this model.',
  },
  'neural-chat': {
    name: 'neural-chat:7b',
    size: '7GB',
    speed: '⚡⚡ Fast',
    description: '❌ NOT SAFE - Will freeze system (7.6GB RAM available)',
    tags: ['chat', 'conversation', 'medium-speed'],
    warning: '⚠️  TOO LARGE FOR 7.6GB RAM! System will freeze. Skip this model.',
  },
  'orca-mini': {
    name: 'orca-mini:3b',
    size: '3GB',
    speed: '⚡⚡⚡ Very Fast',
    description: 'Compact model - Good quality, very responsive',
    tags: ['lightweight', 'general', 'fast'],
    warning: null,
  },
  'phi': {
    name: 'phi:2.7b',
    size: '2.7GB',
    speed: '⚡⚡⚡ Super Fast',
    description: 'Micro model - Extremely fast, minimal resource usage',
    tags: ['micro', 'ultra-light', 'instant'],
    warning: null,
  },
  'codellama': {
    name: 'codellama:7b',
    size: '7GB',
    speed: '⚡⚡ Fast',
    description: '❌ NOT SAFE - Will freeze system (7.6GB RAM available)',
    tags: ['code-gen', 'programming', 'expert'],
    warning: '⚠️  TOO LARGE FOR 7.6GB RAM! System will freeze. Skip this model.',
  },
  'gemma3': {
    name: 'gemma3:270m',
    size: '270MB',
    speed: '⚡⚡⚡⚡ Ultra Fast',
    description: 'Lightweight model - Perfect for 7.6GB system',
    tags: ['micro', 'ultra-light', 'super-fast'],
    warning: null,
  },
};

export const MODEL_RECOMMENDATIONS = {
  'code-generation': ['deepseek-coder', 'orca-mini'],  // Removed 7B models
  'chat': ['orca-mini', 'gemma3', 'phi'],              // Removed 7B models
  'general': ['orca-mini', 'phi', 'gemma3'],           // Removed 7B models
  'lightweight': ['deepseek-coder', 'phi', 'gemma3'],
  'fastest': ['gemma3', 'phi', 'deepseek-coder'],      // Fastest first
};

export const OLLAMA_INSTALL_INSTRUCTIONS = `
# Installation of Ollama

1. **Download Ollama**
   - Visit: https://ollama.ai
   - Download for your OS (macOS, Linux, Windows)

2. **Install & Start Ollama**
   - macOS/Linux: Follow installer
   - Windows: Run installer
   - Start Ollama service

3. **Pull a Model**
   Option A - Via CLI:
   \`\`\`bash
   ollama pull deepseek-coder:1.3b
   \`\`\`

   Option B - Via this app:
   - Go to Settings → Models
   - Click "Download Model"
   - Select from recommended list

4. **Verify Installation**
   \`\`\`bash
   curl http://localhost:11434/api/tags
   \`\`\`

5. **Keep Ollama Running**
   - Ollama service must be running for models to work
   - Check if it's running: http://localhost:11434 should respond

# Recommended Models

${Object.entries(RECOMMENDED_MODELS)
  .map(
    ([key, model]) =>
      `- **${model.name}** (${model.size}) - ${model.description}
     Speed: ${model.speed}`
  )
  .join('\n')}

# Model Selection Guide

**For Code Generation:** deepseek-coder, codellama
**For Chat:** neural-chat, mistral
**For Lightweight/Fast:** phi, deepseek-coder, orca-mini
**For General Use:** mistral, orca-mini

# Troubleshooting

- **"Cannot connect to Ollama"**: Make sure Ollama is running
- **"Model not found"**: Pull the model first with \`ollama pull model-name\`
- **"Slow responses"**: Switch to a lighter model (phi, deepseek-coder)
- **"Out of memory"**: Use micro models (phi, orca-mini)
`;
