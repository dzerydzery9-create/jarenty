import React from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { Terminal } from './components/Terminal';
import { ModelManager } from './components/ModelManager';

function App() {
  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-1/4 p-2 border-r">
          <ModelManager />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-2">
            <ChatInterface />
          </div>
          <div className="h-1/3 border-t p-2">
            <Terminal />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
