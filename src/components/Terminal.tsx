import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';

import { Terminal as XTerm } from 'xterm';&#10;&#10;const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([
    '$ AI Agent Builder Terminal',
    '$ Ollama Models Ready',
    '$ Type commands below...',
    '',
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const terminal = new XTerm();
    if (terminalRef.current) {
      terminal.open(terminalRef.current);
      terminal.write('Welcome to the AI Agent Builder Terminal!\r\n');
    }
  }, []);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const newLines = [...lines, `$ ${cmd}`];

    // Simulate command output
    if (cmd.toLowerCase() === 'ollama list') {
      newLines.push('Models available via localhost:11434');
    } else if (cmd.toLowerCase().startsWith('ollama pull')) {
      newLines.push('Downloading model...');
    } else {
      newLines.push(`Command executed: ${cmd}`);
    }

    newLines.push('');
    setLines(newLines);
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="h-full flex flex-col bg-gray-950 text-green-400 font-mono text-sm p-4">
      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4 space-y-1 font-mono text-sm"
      >
        {lines.map((line, idx) => (
          <div key={idx}>{line || '\u00a0'}</div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <span className="text-green-400">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCommand(input)}
          className="flex-1 bg-transparent text-green-400 outline-none border-none"
          placeholder="Enter command..."
        />
      </div>
    </div>
  );
};

export default Terminal;
