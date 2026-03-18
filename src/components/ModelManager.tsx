import React, { useState, useEffect } from 'react';
import OllamaService, { OllamaModel } from '../services/OllamaService';
import { RECOMMENDED_MODELS } from '../services/ModelRecommendations';
import { Download, Trash2, Check } from 'lucide-react';

const ModelManager: React.FC = () => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const available = await OllamaService.isAvailable();
      if (!available) {
        setError('Ollama is not running. Please start Ollama first.');
        return;
      }
      const modelList = await OllamaService.listModels();
      setModels(modelList);
    } catch (err) {
      setError('Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async (modelName: string) => {
    try {
      setDownloading(modelName);
      await OllamaService.pullModel(modelName);
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

  if (error) {
    return (
      <div className="p-6 bg-red-900 bg-opacity-30 border border-red-700 rounded">
        <p className="text-red-300">{error}</p>
        <button
          onClick={loadModels}
          className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Model Manager</h2>
        
        {/* Installed Models */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Check size={20} className="text-green-500" />
            Installed Models ({models.length})
          </h3>
          {models.length > 0 ? (
            <div className="grid gap-3">
              {models.map((model) => (
                <div
                  key={model.name}
                  className="p-3 bg-gray-800 rounded border border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-green-400">{model.name}</p>
                    <p className="text-xs text-gray-500">{model.size || 'Unknown size'}</p>
                  </div>
                  <button className="p-2 hover:bg-red-900 rounded text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No models installed yet</p>
          )}
        </div>

        {/* Recommended Models */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Download size={20} className="text-blue-400" />
            Download Recommended Models
          </h3>
          <div className="grid gap-3">
            {Object.entries(RECOMMENDED_MODELS).map(([key, model]) => {
              const isInstalled = models.some((m) => m.name === model.name);
              const isDownloading = downloading === model.name;

              return (
                <div
                  key={key}
                  className="p-4 bg-gray-800 rounded border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{model.name}</p>
                      <p className="text-sm text-gray-400">{model.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{model.size}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{model.speed}</span>
                        {model.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => !isInstalled && downloadModel(model.name)}
                      disabled={isInstalled || isDownloading}
                      className={`px-4 py-2 rounded font-semibold transition-colors ${
                        isInstalled
                          ? 'bg-green-900 text-green-200 cursor-default'
                          : isDownloading
                          ? 'bg-yellow-900 text-yellow-200 cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isInstalled ? '✓ Installed' : isDownloading ? '⬇ Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelManager;
