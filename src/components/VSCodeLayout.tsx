import React from 'react';
import Terminal from './Terminal';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import './VSCodeLayout.css';

const VSCodeLayout: React.FC = () => {
    return (
        <div className="vscode-layout">
            <Sidebar />
            <div className="main-content">
                <div className="terminal-chat">
                    <Terminal />
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
};

export default VSCodeLayout;