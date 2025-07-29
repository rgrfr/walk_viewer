import React from 'react';
import Icon from '../../../components/AppIcon';

const WalkCounter = ({ filteredCount, totalCount, lastChecked, includePastWalks, onTogglePastWalks }) => {
  const formatLastChecked = (timestamp) => {
    const now = new Date();
    const checked = new Date(timestamp);
    const diffMinutes = Math.floor((now - checked) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes === 1) return '1 minute ago';
    return `${diffMinutes} minutes ago`;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {filteredCount} of {totalCount} walks
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Icon name="RefreshCw" size={14} />
          <span>website last checked {formatLastChecked(lastChecked)}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={includePastWalks}
            onChange={(e) => onTogglePastWalks(e.target.checked)}
            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span>Include past walks</span>
        </label>
      </div>
    </div>
  );
};

export default WalkCounter;