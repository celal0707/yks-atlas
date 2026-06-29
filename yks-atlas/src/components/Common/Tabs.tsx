import { ReactNode, useState } from 'react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
    icon?: ReactNode;
  }[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export default function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      {/* Tab buttons */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">{activeTabContent}</div>
    </div>
  );
}
