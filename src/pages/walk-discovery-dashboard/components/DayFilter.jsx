import React from 'react';
import Button from '../../../components/ui/Button';

const DayFilter = ({ selectedDays, onDayToggle }) => {
  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Day</h3>
      <div className="flex space-x-1 overflow-x-auto pb-2">
        {days.map((day) => (
          <Button
            key={day.key}
            variant={selectedDays.includes(day.key) ? "default" : "outline"}
            size="sm"
            onClick={() => onDayToggle(day.key)}
            className={`flex-shrink-0 min-w-[32px] w-[32px] text-xs ${
              selectedDays.includes(day.key) 
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' :'hover:bg-orange-500 hover:border-orange-500 hover:text-white'
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