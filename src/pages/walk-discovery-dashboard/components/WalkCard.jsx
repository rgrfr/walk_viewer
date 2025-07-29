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

  // Function to handle the ripple effect on button click
  const addRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    
    // Determine ripple color based on button's hover theme
    let rippleColor = 'rgba(255, 255, 255, 0.4)'; // Default white for green-hovered
    if (button.classList.contains('hover-blue')) {
      rippleColor = 'rgba(29, 78, 216, 0.3)'; // blue-700 with opacity
    } else if (button.classList.contains('hover-neutral')) {
        rippleColor = 'rgba(55, 65, 81, 0.3)'; // gray-700 with opacity
    }
    ripple.style.backgroundColor = rippleColor;

    ripple.classList.add('ripple-span');

    // Remove existing ripple spans to prevent multiple animations stacking
    const existingRipple = button.querySelector('.ripple-span');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    // Remove the ripple element after animation
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  // Custom CSS for tooltips and ripple effect
  // This CSS should preferably be moved to your main CSS file (e.g., src/index.css)
  const buttonStyle = `
    /* Tooltip styles */
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

    /* Ripple effect (using dynamically created span) */
    .ripple-span {
      position: absolute;
      border-radius: 50%;
      opacity: 1;
      transform: scale(0);
      animation: ripple-animation 0.5s ease-out forwards;
      pointer-events: none; /* Allows clicks to pass through */
      z-index: 1; /* Below tooltip, above button content */
    }

    @keyframes ripple-animation {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
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
          {walk.description.replace(/\\'/g, "'")} {/* Sanitized description */}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2"> {/* Uses gap-2 for consistent spacing */}
        <Button
          className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
          size="xs"
          iconName="Calendar"
          onClick={(e) => { addRipple(e); onCalendarAdd(walk, 'google'); }}
          data-tooltip="Add details to your Google calendar"
        >
          Google
        </Button>
        <Button
          className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
          size="xs"
          iconName="Calendar"
          onClick={(e) => { addRipple(e); onCalendarAdd(walk, 'outlook'); }}
          data-tooltip="Add details to your Outlook calendar"
        >
          Outlook
        </Button>
        <Button
          className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
          size="xs"
          iconName="Calendar"
          onClick={(e) => { addRipple(e); onCalendarAdd(walk, 'apple'); }}
          data-tooltip="Download .ics for Apple calendar"
        >
          Apple
        </Button>

        <Button
          className={`${baseButtonClasses} hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-blue-300 action-button hover-blue`}
          size="xs"
          iconName="Facebook"
          onClick={(e) => { addRipple(e); onFacebookShare(walk); }}
          data-tooltip="Copy text to a Facebook post"
        >
          Share
        </Button>

        {walk.postcode && (
          <Button
            className={`${baseButtonClasses} hover:bg-green-50 hover:border-green-400 hover:text-green-600 hover:shadow-green-300 action-button hover-green`}
            size="xs"
            iconName="MapPin"
            onClick={(e) => { addRipple(e); onLocationClick(walk.postcode); }}
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
              onClick={(e) => { addRipple(e); onMeetClick(walk.what3words, 'web'); }}
              data-tooltip="Show the exact meeting place on what3words.com"
            >
              Meet
            </Button>
            <Button
              className={`${baseButtonClasses} hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-blue-300 action-button hover-blue`}
              size="xs"
              iconName="Smartphone"
              onClick={(e) => { addRipple(e); onMeetClick(walk.what3words, 'app'); }}
              data-tooltip="Mobile only: Open what3words app at meeting place"
            >
              w3w
            </Button>
          </>
        )}

        {/* New 'Details' button */}
        {walk.details_url && (
          <Button
            className={`${baseButtonClasses} bg-gray-700 text-white border-gray-700 hover:bg-gray-600 hover:border-gray-600 hover:shadow-gray-400 action-button hover-neutral`}
            size="xs"
            iconName="Globe" // Using a 'Globe' or 'ExternalLink' icon is good for web links
            onClick={(e) => { addRipple(e); window.open(walk.details_url, '_blank'); }}
            data-tooltip="View full walk details on the Ramblers website"
          >
            Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalkCard;
