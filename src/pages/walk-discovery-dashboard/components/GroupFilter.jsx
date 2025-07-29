import React from 'react';
import Button from '../../../components/ui/Button';

const GroupFilter = ({ groups, selectedGroups, onGroupToggle }) => {
  const truncateGroupName = (name) => {
    const truncateMap = {
      'Royston': 'Royston',
      'Cambridge': 'Cambridge',
      'East Hertfordshire': 'East Herts',
      'North Hertfordshire': 'North Herts',
      'Walk Cambridge': 'Walk Camb',
      'Staines': 'Staines',
      'Inner London': 'Inner Lon',
      'Ivel': 'Ivel',
      'Sudbury': 'Sudbury',
      'Uttlesford': 'Uttlesford',
      'Newmarket': 'Newmarket',
      'Huntingdon': 'Huntingdon'
    };
    
    return truncateMap[name] || name.substring(0, 10);
  };

  const handleAllGroupsToggle = () => {
    if (selectedGroups.length === groups.length) {
      // If all groups are selected, deselect all
      groups.forEach(group => onGroupToggle(group));
    } else {
      // If not all groups are selected, select all
      groups.forEach(group => {
        if (!selectedGroups.includes(group)) {
          onGroupToggle(group);
        }
      });
    }
  };

  // Always show the filter section, even if groups array is empty
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Group</h3>
      <div className="flex flex-wrap gap-2">
        {groups.length > 0 ? (
          <>
            {/* All Groups toggle button */}
            <Button
              variant={selectedGroups.length === groups.length ? "default" : "outline"}
              size="sm"
              onClick={handleAllGroupsToggle}
              className={`${
                selectedGroups.length === groups.length
                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' :'hover:bg-green-500 hover:border-green-500 hover:text-white'
              }`}
            >
              All Groups
            </Button>
            
            {groups.map((group) => (
              <Button
                key={group}
                variant={selectedGroups.includes(group) ? "default" : "outline"}
                size="sm"
                onClick={() => onGroupToggle(group)}
                className={`${
                  selectedGroups.includes(group)
                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' :'hover:bg-green-500 hover:border-green-500 hover:text-white'
                }`}
              >
                {truncateGroupName(group)}
              </Button>
            ))}
          </>
        ) : (
          <div className="text-sm text-gray-500 italic flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading group filters...
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupFilter;