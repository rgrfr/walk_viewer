import React from 'react';
import Icon from '../../../components/AppIcon';

const WalkCounter = ({ filteredCount, totalCount, lastChecked, includePastWalks, onTogglePastWalks }) => {
  const formatLastChecked = (timestamp) => {
    // If timestamp is null or invalid, return a placeholder
    if (!timestamp) {
      return 'N/A'; // or 'loading...' or ''
    }

    const now = new Date();
    const checked = new Date(timestamp);
    const diffMilliseconds = now - checked; // Difference in milliseconds

    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'just now';
    } else if (diffMinutes < 60) { // Less than an hour
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) { // Less than a day
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) { // Less than a week
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
      // For anything over a week, be less specific
      return 'more than a week ago';
      // Alternatively, to show an exact date:
      // return checked.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm"> {/* Reduced padding and set base text size */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        {/* Walk Count and Include Past Walks on the first line */}
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} className="text-gray-600" />
          <span className="font-medium text-gray-900">
            {filteredCount} of {totalCount} walks
          </span>

          {/* Input Checkbox and 'include past walks' - justified right within its line on smaller screens, and with the count on larger screens */}
          <label className="flex items-center space-x-2 text-gray-700 cursor-pointer ml-auto sm:ml-4"> {/* ml-auto pushes it right */}
            <input
              type="checkbox"
              checked={includePastWalks}
              onChange={(e) => onTogglePastWalks(e.target.checked)}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span>Include past walks. CHECK the deets as cancelled walks are still listed (bug) </span>
          </label>
        </div>

        {/* Website last checked feature - on a new line below on small screens, justified right */}
        <div className="flex items-center justify-end space-x-2 text-xs text-gray-500"> {/* justify-end pushes it right */}
          <Icon name="RefreshCw" size={14} />
          <span>website last checked {formatLastChecked(lastChecked)}</span>
        </div>
      </div>
    </div>
  );
};

export default WalkCounter;
