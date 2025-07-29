import React from 'react';
import Button from '../../../components/ui/Button';

const DayFilter = ({ selectedDays, onDayToggle }) => {
  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', 'label': 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  // Base styles for DayFilter buttons, matching the height of WalkCard/GroupFilter buttons (py-2 px-3)
  // min-w is adjusted for 3-letter labels, allowing flex-grow to distribute space effectively
  const baseDayButtonClasses = `
    flex-grow min-w-[36px] text-xs font-medium py-2 px-3 rounded-xl
    border border-gray-300 bg-white text-gray-700
    shadow-md shadow-gray-200 transition-all duration-200 ease-in-out
    relative overflow-hidden
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
  `;

  // Custom CSS for the ripple effect. Embedded directly for simplicity.
  const buttonStyle = `
    .day-filter-button::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none; /* Allows clicks to pass through */
      transform: translate(-50%, -50%) scale(0); /* Center and initially scale to 0 */
      transition: transform 0.5s ease-out, opacity 0.5s ease-out;
      z-index: 1;
      top: 50%; /* Position from center */
      left: 50%; /* Position from center */
      width: 100%; /* Base size for ripple before scaling up */
      height: 100%; /* Base size for ripple before scaling up */
    }

    /* Ripple color for selected (green) */
    .day-filter-button.is-selected:active::after {
      background-color: rgba(255, 255, 255, 0.4); /* White ripple on green selected */
    }

    /* Ripple color for unselected/hovered (greenish) */
    .day-filter-button:not(.is-selected):active::after {
      background-color: rgba(21, 128, 61, 0.3); /* green-700 with opacity */
    }

    .day-filter-button:active::after {
      transform: translate(-50%, -50%) scale(2); /* Expands the ripple from center */
      opacity: 0; /* Fades out */
    }
  `;

  return (
    <div className="mb-4">
      <style>{buttonStyle}</style> {/* Inject custom CSS */}
      <h3 className="text-sm font-medium text-gray-700 mb-2">filter by Day</h3>
      <div className="flex flex-wrap gap-1">
        {days.map((day) => (
          <Button
            key={day.key}
            // Using size="xs" for consistency with other action buttons (WalkCard, GroupFilter)
            size="xs"
            onClick={() => onDayToggle(day.key)}
            className={`${baseDayButtonClasses} day-filter-button ${
              selectedDays.includes(day.key)
                ? 'bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-green-300 is-selected'
                : 'hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300'
            }`}
          >
            {day.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DayFilter;
