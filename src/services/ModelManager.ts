export interface Model {
    name: string;
    size: string; // in GB
    speed: string; // inference speed
    memoryRequired: string;
    description: string;
}

export const LIGHTWEIGHT_MODELS: Model[] = [
    {
        name: 'phi-2',
        size: '2.7GB',
        speed: 'Very Fast',
        memoryRequired: '4GB',
        description: 'Microsoft\'s lightweight 2.7B parameter model - excellent for reasoning and coding',
    },
    {
        name: 'qwen2.5:0.5b',
        size: '0.5GB',
        speed: 'Fast',
        memoryRequired: '2GB',
        description: 'Qwen2.5 0.5B - Lightweight, fast Polish/English support',
    },
    {
        name: 'neural-chat-7b',
        size: '4.1GB',
        speed: 'Fast',
        memoryRequired: '6GB',
        description: 'Intel\'s optimized chat model - good balance of speed and quality',
    },
    {
        name: 'orca-mini-7b',
        size: '3.8GB',
        speed: 'Fast',
        memoryRequired: '6GB',
        description: 'Mistral-based model optimized for instruction following',
    },
    {
        name: 'mistral-7b',
        size: '3.8GB',
        speed: 'Fast',
        memoryRequired: '6GB',
        description: 'Fast and capable 7B model - great for code generation',
    },
];

export class ModelManager {
    private selectedModel: string = 'phi-2';
    private installedModels: Set<string> = new Set();

    setSelectedModel(model: string) {
        this.selectedModel = model;
    }

    getSelectedModel(): string {
        return this.selectedModel;
    }

    addInstalledModel(model: string) {
        this.installedModels.add(model);
    }

    getInstalledModels(): string[] {
        return Array.from(this.installedModels);
    }

    getModelInfo(modelName: string): Model | undefined {
        return LIGHTWEIGHT_MODELS.find(m => m.name === modelName);
    }

    getAllModels(): Model[] {
        return LIGHTWEIGHT_MODELS;
    }

    isModelInstalled(modelName: string): boolean {
        return this.installedModels.has(modelName);
    }
}

export const modelManager = new ModelManager();
