import React from 'react';

interface Panel {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ActivityBarProps {
  panels: Panel[];
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ panels, activePanel, setActivePanel }) => {
  return (
    <div className="w-14 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-4">
      {panels.map((panel) => (
        <button
          key={panel.id}
          onClick={() => setActivePanel(panel.id)}
          className={`p-3 rounded transition-colors ${
            activePanel === panel.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:text-gray-400 hover:bg-gray-800'
          }`}
          title={panel.label}
        >
          {panel.icon}
        </button>
      ))}

      {/* Settings at bottom */}
      <div className="flex-1" />
      <button
        className="p-3 rounded text-gray-500 hover:text-gray-400 hover:bg-gray-800 transition-colors"
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  );
};

export default ActivityBar;
