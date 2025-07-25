import { useState } from 'react';
import PolicyEditor from '../components/PolicyEditormock';

const tabList = ['terms & Conditions', 'warranty', 'shipping'];

const PolicyEditorPage = () => {
  const [activeTab, setActiveTab] = useState('terms & Conditions');

  return (
    <div className="space-y-6 bg-white p-1 rounded">
      {/* Tabs */}
      <div className="flex gap-4">
        {tabList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize cursor-pointer border-b-2 transition ${
              activeTab === tab
                ? 'border-[#783904] text-[#783904]'
                : 'border-transparent text-gray-400 hover:text-[#783904]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Editor */}
      <PolicyEditor title={activeTab} />
    </div>
  );
};

export default PolicyEditorPage;
