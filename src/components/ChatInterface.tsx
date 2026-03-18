import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { AgentAPIClient } from '../services/AgentAPIClient';
import { LIGHTWEIGHT_MODELS } from '../services/ModelManager';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: string;
}

const ChatInterface: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('CodeGenerationAgent');
const [selectedModel, setSelectedModel] = useState<string>('qwen2.5:0.5b');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Agent Builder assistant. I can help you create projects, generate code, and manage agents. What would you like to build?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Real agent integration
    try {
      // Use Agent API to assign task
      const taskId = `task-${Date.now()}`;
      await AgentAPIClient.assignTask(selectedAgent, taskId, {
        query: input,
        model: selectedModel,
      });

      const agentManager = (window as any).AgentManager?.getInstance();
      if (agentManager) {
        const task = {
          id: taskId,
          type: 'code-generation', // TODO: classify input to type
          description: input,
          input: { prompt: input, language: 'typescript', model: selectedModel }
        };
        const result = await agentManager.autoExecuteTask(task as any);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.success 
            ? `[${selectedAgent}] ${result.output}` 
            : `[${selectedAgent}] Error: ${result.errors?.join(', ') || 'Unknown error'}`,
          timestamp: new Date(),
          agent: selectedAgent,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Processing with ${selectedAgent} using ${selectedModel} model...`,
          timestamp: new Date(),
          agent: selectedAgent,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `[${selectedAgent}] Error processing request: ${error}`,
        timestamp: new Date(),
        agent: selectedAgent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

// sendMessage replaced by handleSendMessage with proper Message type

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Agent and Model Selector */}
      <div className="flex gap-2 p-3 bg-gray-800 border-b border-gray-700">
        <select 
          value={selectedAgent} 
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded text-sm"
        >
          <option value="CodeGenerationAgent">Code Generation</option>
          <option value="DebuggingAgent">Debugging</option>
          <option value="TestingAgent">Testing</option>
          <option value="UIAgent">UI/UX</option>
          <option value="ProjectAnalysisAgent">Project Analysis</option>
          <option value="FileSystemAgent">File System</option>
        </select>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded text-sm"
        >
          {LIGHTWEIGHT_MODELS.map(model => (
            <option key={model.name} value={model.name}>{model.name} ({model.size})</option>
          ))}
        </select>
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 border border-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
