import React from 'react';
import Button from '../../../components/ui/Button'; // Assuming this Button component accepts and applies className properly

const GroupFilter = ({ groups, selectedGroups, onGroupToggle }) => {
  // Function to truncate group names for display
  const truncateGroupName = (name) => {
    const truncateMap = {
      'Royston Group': 'Royston',
      'Cambridge Group': 'Cambridge',
      'East Hertfordshire Group': 'East Herts',
      'North Hertfordshire Group': 'North Herts',
      'Walk Cambridge Group': 'Walk Cambs',
      'Staines Group': 'Staines',
      'Inner London Group': 'London',
      'Ivel Valley Group': 'Ivel',
      'Sudbury Group': 'Sudbury',
      'Uttlesford Group': 'Uttlesford',
      'Newmarket & District Group': 'Newmarket',
      'Huntingdonshire Group': 'Huntingdon'
    };

    const mappedName = truncateMap[name];
    if (mappedName) {
      return mappedName;
    } else {
      // If not in map, truncate and add ellipsis if longer than a reasonable length
      const maxLength = 12; // Maximum characters before truncation for unmapped names
      if (name.length > maxLength) {
        return name.substring(0, maxLength - 3) + '...'; // Truncate and add ellipsis
      }
      return name;
    }
  };

  // Handler for the "All Groups" toggle button
  const handleAllGroupsToggle = () => {
    if (selectedGroups.length === groups.length) {
      // If all groups are currently selected, deselect all of them
      groups.forEach(group => onGroupToggle(group));
    } else {
      // If not all groups are selected, select all missing ones
      groups.forEach(group => {
        if (!selectedGroups.includes(group)) {
          onGroupToggle(group);
        }
      });
    }
  };

  // Logic to reorder groups: 'Royston Group' first, then others sorted alphabetically
  const roystonGroup = groups.find(group => group === 'Royston Group');
  // Filter out Royston, then sort the remaining groups
  const otherGroups = groups.filter(group => group !== 'Royston Group').sort();
  // Create the final ordered list of groups
  const orderedGroups = roystonGroup ? [roystonGroup, ...otherGroups] : [...otherGroups];


  // Common Tailwind classes for all filter buttons to ensure consistent base styling
  // These classes define the button's size, shape, transitions, and prepare for the ripple effect
  const baseButtonClasses = `
    flex-grow           // Allows buttons to grow to fill available horizontal space
    min-w-[90px]        // Ensures buttons don't shrink below a minimum width on small screens
    text-xs             // Sets a small text size for compactness
    font-medium         // Applies a medium font weight
    py-2 px-3           // Provides internal padding for a comfortable button size
    rounded-xl        // Makes the button fully rounded (pill shape)
    transition-all duration-200 ease-in-out // Smooths transitions for hover and active states
    relative overflow-hidden // Essential for containing the CSS ripple animation
    group-filter-button // Custom class used by the <style> block for the ripple effect
  `;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">filter by Group</h3>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start"> {/* Uses gap for spacing, centers on mobile, left-aligns on larger screens */}
        {groups.length > 0 ? (
          <>
            {/* Individual Group buttons: Royston first, then others sorted */}
            {orderedGroups.map((group) => (
              <Button
                key={group} // Using the group name as a key (assuming uniqueness)
                // Dynamically apply active/inactive styles based on selection status
                className={`${baseButtonClasses} ${
                  selectedGroups.includes(group)
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-400' // Active state (orange background)
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 hover:shadow-md hover:shadow-orange-200' // Inactive state (white background, gray/orange outline)
                }`}
                onClick={() => onGroupToggle(group)}
              >
                {truncateGroupName(group)}
              </Button>
            ))}

            {/* "All Groups" toggle button: Rendered last, using green theme */}
            <Button
              className={`${baseButtonClasses} ${
                selectedGroups.length === groups.length
                  ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-400' // Active state (green background)
                  : 'bg-white text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 hover:text-green-800 hover:shadow-md hover:shadow-green-200' // Inactive state (white background, green outline)
              }`}
              onClick={handleAllGroupsToggle}
            >
              All Groups
            </Button>
          </>
        ) : (
          // Loading state display when no groups are available
          <div className="text-sm text-gray-500 italic flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading group filters...
          </div>
        )}
      </div>

      {/* CSS for the Ripple Effect */}
      {/* This <style> block is embedded for direct application within the component. */}
      {/* In a larger project, you might consider placing this in a global CSS file. */}
      <style>{`
        /* General ripple effect for when any .group-filter-button is clicked */
        .group-filter-button:active:after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4); /* Default ripple: translucent white for selected buttons */
          width: 0;
          height: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: ripple-animation 0.5s ease-out forwards; /* Triggers the ripple animation */
          pointer-events: none; /* Allows clicks to pass through the ripple overlay */
        }

        /* Override ripple color for non-selected buttons (white background) */
        .group-filter-button.bg-white:active:after {
          background-color: rgba(249, 115, 22, 0.3); /* Default to translucent orange for unselected group buttons */
        }

        /* Specific ripple color for the "All Groups" button when it's unselected (green theme) */
        /* This selector targets buttons that are white background AND have green text (indicating the 'All Groups' unselected state) */
        .group-filter-button.bg-white.text-green-700:active:after {
          background-color: rgba(34, 197, 94, 0.3); /* Translucent green ripple for 'All Groups' */
        }

        /* Keyframe animation definition for the ripple effect */
        @keyframes ripple-animation {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 200%; /* Expands the ripple to cover the entire button */
            height: 200%;
            opacity: 0; /* Fades out the ripple as it expands */
          }
        }
      `}</style>
    </div>
  );
};

export default GroupFilter;
