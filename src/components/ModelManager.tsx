import React, { useState, useEffect } from 'react';
import OllamaService, { OllamaModel } from '../services/OllamaService';
import { RECOMMENDED_MODELS } from '../services/ModelRecommendations';
import { Download, Trash2, Check, ChevronDown } from 'lucide-react';

const ModelManager: React.FC = () => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [provider, setProvider] = useState<'ollama' | 'openai' | 'claude'>('ollama');

  useEffect(() => {
    loadModels();
  }, [provider]);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError('');
      if (provider === 'ollama') {
        const available = await OllamaService.isAvailable();
        if (!available) {
          setError('Ollama is not running. Please start Ollama first.');
          return;
        }
        const modelList = await OllamaService.listModels();
        setModels(modelList);
      } else if (provider === 'openai') {
        const apiKey = localStorage.getItem('openaiApiKey');
        if (!apiKey) {
          setError('OpenAI API key not set. Please configure in Settings.');
          return;
        }
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch OpenAI models');
        }
        const data = await response.json();
        const openaiModels = data.data.map((model: any) => ({
          name: model.id,
          size: model.usage,
          pulled: true,
        }));
        setModels(openaiModels);
      } else if (provider === 'claude') {
        setError('Claude model listing not implemented yet');
        return;
      }
    } catch (err) {
      setError('Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async (modelName: string) => {
    try {
      setDownloading(modelName);
      if (provider === 'ollama') {
        await OllamaService.pullModel(modelName);
      }
      await loadModels();
    } catch (err) {
      setError(`Failed to download ${modelName}`);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin text-blue-500">⌛</div>
        <p className="mt-2 text-gray-400">Loading models...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Wybierz dostawcę modeli</label>
        <div className="relative">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'ollama' | 'openai' | 'claude')}
            className="w-full p-2 border rounded-md appearance-none pr-8"
          >
            <option value="ollama">Ollama</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{model.name}</h3>
              {downloading === model.name ? (
                <div className="animate-spin text-blue-500">🔄</div>
              ) : (
                <button
                  onClick={() => downloadModel(model.name)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Download size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{model.size}</p>
            <div className="mt-2 flex items-center">
              <Check className="text-green-500 mr-1" size={14} />
              <span className="text-xs text-gray-600">Pulled</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelManager;
