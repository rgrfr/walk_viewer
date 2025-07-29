import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalkCard = ({ walk, onCalendarAdd, onFacebookShare, onLocationClick, onMeetClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'leisurely':
        return 'text-green-700 bg-green-100'; // Pale green
      case 'moderate':
        return 'text-orange-700 bg-orange-100'; // Pale orange
      default:
        return 'text-red-700 bg-red-100'; // Pale red for anything else
    }
  };

  // Base styles for all action buttons
  // min-w-[90px] chosen to comfortably fit common labels like "Location" and "Outlook"
  // flex-grow makes them take up equal available space
  const baseButtonClasses = `
    flex-grow min-w-[90px] text-xs font-medium py-2 px-3 rounded-xl
    border border-gray-300 bg-white text-gray-700
    shadow-md shadow-gray-200 transition-all duration-200 ease-in-out
    relative overflow-hidden group // 'group' class for tooltip targeting
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
  `;

  // Custom CSS for tooltips and ripple effect
  // Embedded directly for simplicity, but could be in a separate CSS file
  const buttonStyle = `
    .action-button::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 8px); /* Position above the button */
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      font-size: 0.75rem; /* text-xs */
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
      z-index: 10; /* Ensure tooltip is above other elements */
    }

    .action-button::after {
      content: '';
      position: absolute;
      bottom: calc(100% + 4px); /* Position just above the tooltip arrow */
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background-color: rgba(0, 0, 0, 0.75);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
      z-index: 10;
    }

    .action-button:hover::before,
    .action-button:hover::after {
      opacity: 1;
      visibility: visible;
    }

    /* Ripple effect */
    .action-button::before { /* Re-using ::before for tooltip, so using ::after for ripple */
      content: '';
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none; /* Allows clicks to pass through */
      transform: scale(0);
      transition: transform 0.5s ease-out, opacity 0.5s ease-out;
      background-color: rgba(255, 255, 255, 0.4); /* Default ripple color */
      z-index: 1; /* Below tooltip, above button content */
    }

    /* Green hover ripple override for specific buttons */
    .action-button.hover-green:active::after {
      background-color: rgba(21, 128, 61, 0.3); /* green-700 with opacity */
    }

    /* Blue hover ripple override for specific buttons */
    .action-button.hover-blue:active::after {
      background-color: rgba(29, 78, 216, 0.3); /* blue-700 with opacity */
    }


    .action-button:active::after {
      transform: scale(2); /* Expands the ripple */
      opacity: 0; /* Fades out */
    }
  `;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <style>{buttonStyle}</style> {/* Inject custom CSS */}

      {/* Title - now spans full width */}
      <h3 className="font-semibold text-gray-900 text-lg mb-2">
        {walk.title}
      </h3>

      {/* Date, Time, Distance, Group, Difficulty - all on one line, wrapping on mobile */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-3">
        {/* Date */}
        <span className="flex items-center">
          <Icon name="Calendar" size={16} className="mr-1" />
          {formatDate(walk.walk_date)}
        </span>
        {/* Time */}
        <span className="flex items-center">
          <Icon name="Clock" size={16} className="mr-1" />
          {formatTime(walk.walk_date)}
        </span>
        {/* Distance (miles suffix removed) */}
        <span className="font-medium text-gray-900">
          {walk.distance}
        </span>
        {/* Group name */}
        {walk.group_name && (
          <span className="inline-block bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-xs">
            {walk.group_name}
          </span>
        )}
        {/* Difficulty */}
        {walk.difficulty && (
          <span className={`inline-block px-2 py-1 rounded-full font-medium text-xs ${getDifficultyColor(walk.difficulty)}`}>
            {walk.difficulty}
          </span>
        )}
      </div>

      {/* Description - now displays in full */}
      {walk.description && (
        <p className="text-gray-700 text-sm mb-4">
          {walk.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2"> {/* Uses gap-2 for consistent spacing */}
        <Button
          className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
          size="xs" // Retain original size prop for component compatibility
          iconName="Calendar"
          onClick={() => onCalendarAdd(walk, 'google')}
          data-tooltip="Add details to your Google calendar"
        >
          Google
        </Button>
        <Button
          className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
          size="xs"
          iconName="Calendar"
          onClick={() => onCalendarAdd(walk, 'outlook')}
          data-tooltip="Add details to your Outlook calendar"
        >
          Outlook
        </Button>
        <Button
          className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
          size="xs"
          iconName="Calendar"
          onClick={() => onCalendarAdd(walk, 'apple')}
          data-tooltip="Download .ics for Apple calendar"
        >
          Apple
        </Button>

        <Button
          className={`${baseButtonClasses} hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-blue-300 action-button hover-blue`}
          size="xs"
          iconName="Facebook"
          onClick={() => onFacebookShare(walk)}
          data-tooltip="Copy text to a Facebook post"
        >
          Share
        </Button>

        {walk.postcode && (
          <Button
            className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
            size="xs"
            iconName="MapPin"
            onClick={() => onLocationClick(walk.postcode)}
            data-tooltip="Search for the postcode on Google Maps"
          >
            Location
          </Button>
        )}

        {walk.what3words && (
          <>
            <Button
              className={`${baseButtonClasses} hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-blue-300 action-button hover-blue`}
              size="xs"
              iconName="Navigation"
              onClick={() => onMeetClick(walk.what3words, 'web')}
              data-tooltip="Show the exact meeting place on what3words.com"
            >
              Meet
            </Button>
            <Button
              className={`${baseButtonClasses} hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-blue-300 action-button hover-blue`}
              size="xs"
              iconName="Smartphone"
              onClick={() => onMeetClick(walk.what3words, 'app')}
              data-tooltip="Mobile only: Open what3words app at meeting place"
            >
              w3w
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default WalkCard;
