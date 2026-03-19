import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface OllamaModel {
  name: string;
  size: string;
  pulled: boolean;
}

export default class OllamaService {
  static async isAvailable(): Promise<boolean> {
    try {
      await execAsync('ollama --version');
      return true;
    } catch {
      return false;
    }
  }

  static async listModels(): Promise<OllamaModel[]> {
    const { stdout } = await execAsync('ollama list');
    const models = stdout.split('\n').slice(1).filter(line => line.trim() !== '');
    return models.map(model => {
      const [name, size, pulled] = model.split('\t');
      return {
        name: name.trim(),
        size: size.trim(),
        pulled: pulled.trim() === 'true',
      };
    });
  }

  static async pullModel(modelName: string): Promise<void> {
    await execAsync(`ollama pull ${modelName}`);
  }
}
