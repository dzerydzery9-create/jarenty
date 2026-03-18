import React, { useState, useEffect } from 'react';
import OllamaService, { OllamaModel } from '../services/OllamaService';
import ModelManager from './ModelManager';
import { Send, Loader } from 'lucide-react';

interface EditorProps {
  view: string;
}

const Editor: React.FC<EditorProps> = ({ view }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
      {/* Tab Bar */}
      <div className="bg-gray-900 border-b border-gray-800 flex items-center px-4 py-2 gap-2 overflow-x-auto">
        <div className="px-3 py-1 bg-gray-800 border-b-2 border-blue-500 text-sm font-semibold whitespace-nowrap">
          💬 Chat
        </div>
        <div className="px-3 py-1 text-sm text-gray-500 hover:text-gray-400 whitespace-nowrap cursor-pointer">
          🔧 Models
        </div>
        <div className="px-3 py-1 text-sm text-gray-500 hover:text-gray-400 whitespace-nowrap cursor-pointer">
          📝 Welcome
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        {view === 'chat' || true ? (
          <ChatEditor />
        ) : (
          <div className="text-gray-400 p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to AI Agent Builder</h2>
            <p>Select a tab or chat with AI to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatEditor: React.FC = () => {
  const [messages, setMessages] = React.useState<{ role: string; content: string }[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you build projects, generate code, and more. What would you like to do?',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [models, setModels] = React.useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [ollamaAvailable, setOllamaAvailable] = React.useState(false);

  // Load models on mount
  React.useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const available = await OllamaService.isAvailable();
      setOllamaAvailable(available);

      if (!available) {
        setModels([]);
        return;
      }

      const modelList = await OllamaService.listModels();
      setModels(modelList);

      if (modelList.length > 0 && !selectedModel) {
        setSelectedModel(modelList[0].name);
      }
    } catch (err) {
      console.error('Failed to load models:', err);
      setOllamaAvailable(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedModel || !ollamaAvailable) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await OllamaService.chat(selectedModel, [
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user', content: userMessage },
      ]);

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'Failed to get response'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-6">
      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Select AI Model:</label>
        {!ollamaAvailable ? (
          <div className="p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded text-red-300 text-sm">
            ⚠️ Ollama is not running. Start Ollama to use AI features.
            <br />
            <a
              href="https://ollama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-200"
            >
              Download Ollama →
            </a>
          </div>
        ) : models.length === 0 ? (
          <div className="p-3 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded text-yellow-300 text-sm">
            ⚠️ No models downloaded. Go to Models tab to download one.
          </div>
        ) : (
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
          >
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name} ({model.size || 'unknown'})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 bg-gray-900 bg-opacity-30 rounded p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
          placeholder="Ask me anything..."
          disabled={!ollamaAvailable || models.length === 0 || loading}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!ollamaAvailable || models.length === 0 || loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-semibold flex items-center gap-2"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      {/* Button to reload models */}
      {ollamaAvailable && models.length > 0 && (
        <button
          onClick={loadModels}
          className="text-xs text-gray-500 hover:text-gray-400"
        >
          ↻ Refresh models
        </button>
      )}
    </div>
  );
};

export default Editor;
