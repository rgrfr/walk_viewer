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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
            {walk.title}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="flex items-center">
              <Icon name="Calendar" size={16} className="mr-1" />
              {formatDate(walk.walk_date)}
            </span>
            <span className="flex items-center">
              <Icon name="Clock" size={16} className="mr-1" />
              {formatTime(walk.walk_date)}
            </span>
          </div>
        </div>
        <div className="ml-3 text-right">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {walk.distance} miles
          </div>
          {/* Group name and difficulty on same line with color-coded backgrounds */}
          <div className="flex items-center space-x-2 text-xs">
            {walk.group_name && (
              <span className="inline-block bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full">
                {walk.group_name}
              </span>
            )}
            {walk.difficulty && (
              <span className={`inline-block px-2 py-1 rounded-full font-medium ${getDifficultyColor(walk.difficulty)}`}>
                {walk.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {walk.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {walk.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Calendar Buttons */}
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="xs"
            iconName="Calendar"
            onClick={() => onCalendarAdd(walk, 'google')}
            className="text-xs rounded-lg"
          >
            Google
          </Button>
          <Button
            variant="outline"
            size="xs"
            iconName="Calendar"
            onClick={() => onCalendarAdd(walk, 'outlook')}
            className="text-xs rounded-lg"
          >
            Outlook
          </Button>
          <Button
            variant="outline"
            size="xs"
            iconName="Calendar"
            onClick={() => onCalendarAdd(walk, 'apple')}
            className="text-xs rounded-lg"
          >
            Apple
          </Button>
        </div>

        {/* Social & Location Buttons */}
        <Button
          variant="outline"
          size="xs"
          iconName="Facebook"
          onClick={() => onFacebookShare(walk)}
          className="text-xs rounded-lg"
        >
          Share
        </Button>

        {walk.postcode && (
          <Button
            variant="outline"
            size="xs"
            iconName="MapPin"
            onClick={() => onLocationClick(walk.postcode)}
            className="text-xs rounded-lg"
          >
            Location
          </Button>
        )}

        {walk.what3words && (
          <>
            <Button
              variant="outline"
              size="xs"
              iconName="Navigation"
              onClick={() => onMeetClick(walk.what3words, 'web')}
              className="text-xs rounded-lg"
            >
              Meet
            </Button>
            <Button
              variant="outline"
              size="xs"
              iconName="Smartphone"
              onClick={() => onMeetClick(walk.what3words, 'app')}
              className="text-xs rounded-lg"
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