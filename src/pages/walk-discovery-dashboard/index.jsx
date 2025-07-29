import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import WalkCard from './components/WalkCard';
import DayFilter from './components/DayFilter';
import GroupFilter from './components/GroupFilter';
import WalkCounter from './components/WalkCounter';
import FacebookShareModal from './components/FacebookShareModal';
import HeroIllustration from './components/HeroIllustration';

const WalkDiscoveryDashboard = () => {
  const [walks, setWalks] = useState([]);
  const [filteredWalks, setFilteredWalks] = useState([]);
  const [selectedDays, setSelectedDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

  const [selectedGroups, setSelectedGroups] = useState(['Royston Group']);

  const [includePastWalks, setIncludePastWalks] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);
  // Initialize lastChecked to null or an empty string, or handle initial loading state
  // to avoid showing 'just now' before data arrives.
  const [lastChecked, setLastChecked] = useState(null);
  const [facebookModal, setFacebookModal] = useState({ isOpen: false, walk: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch walks from API
    const fetchWalks = async () => {
      setLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('https://rogerfrost.com/api/get_walks.php', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not valid JSON');
        }

        const data = await response.json();

        // Assume the 'walks' data is directly the array, or nested under 'walks' or 'data' key.
        // And 'lastChecked' is a direct property of the main data object.
        const walksData = Array.isArray(data) ? data : (data?.walks || data?.data || []);

        // --- FIX START ---
        // Extract the lastChecked timestamp from the API response
        // Assuming 'data.lastChecked' exists and is a valid date string or timestamp
        if (data && data.lastScrapeTime) {
          setLastChecked(new Date(data.lastScrapeTime));
        } else {
          // Fallback to client's current time if API doesn't provide it
          setLastChecked(new Date());
        }
        // --- FIX END ---

        if (!Array.isArray(walksData)) {
          throw new Error('Invalid data format received from API');
        }

        setWalks(walksData);


        // Extract unique groups
        const groups = [...new Set(walksData.map(walk => walk?.group_name).filter(Boolean))];
        setAvailableGroups(groups);

        if (groups.length > 0 && !groups.includes('Royston Group')) {
            setSelectedGroups([groups[0]]);
        }

      } catch (error) {
        console.error('Error fetching walks:', error);

        let errorMessage = 'Failed to load walks. Please try again later.';

        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Unable to connect to the server. Please try again later.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Server returned invalid data. Please try again later.';
        }

        setError(errorMessage);

        setWalks([]);
        setAvailableGroups([]);
        setLastChecked(null); // Clear lastChecked on error
      } finally {
        setLoading(false);
      }
    };

    fetchWalks();
  }, []);

  useEffect(() => {
    filterWalks();
  }, [walks, selectedDays, selectedGroups, includePastWalks]);

  const filterWalks = () => {
    let filtered = [...walks];

    if (!includePastWalks) {
      const now = new Date();
      filtered = filtered.filter(walk => new Date(walk?.walk_date) >= now);
    }

    if (selectedGroups.length > 0) {
      filtered = filtered.filter(walk => selectedGroups.includes(walk?.group_name));
    }

    if (selectedDays.length > 0) {
      filtered = filtered.filter(walk => {
        const walkDate = new Date(walk?.walk_date);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const walkDay = dayNames[walkDate.getDay()];
        return selectedDays.includes(walkDay);
      });
    }

    filtered.sort((a, b) => new Date(a?.walk_date) - new Date(b?.walk_date));

    setFilteredWalks(filtered);
  };

  const handleDayToggle = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleGroupToggle = (group) => {
    setSelectedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleCalendarAdd = (walk, platform) => {
    const startDate = new Date(walk.walk_date);
    const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));

    const formatDateForCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    let title = walk.title;
    let description = walk.description || '';
    let location = '';

    if (walk.postcode) {
      location = walk.postcode;
    }

    if (walk.what3words) {
      description += `\n\nMeet point: ${walk.what3words}`;
    }

    switch (platform) {
      case 'google':
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
        window.open(googleUrl, '_blank');
        break;

      case 'outlook':
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
        window.open(outlookUrl, '_blank');
        break;

      case 'apple':
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Walk Viewer//Walk Event//EN
BEGIN:VEVENT
UID:${walk.id}@walkviewer.com
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${formatDateForCalendar(startDate)}
DTEND:${formatDateForCalendar(endDate)}
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        link.click();
        URL.revokeObjectURL(url);
        break;
    }
  };

  const handleFacebookShare = (walk) => {
    setFacebookModal({ isOpen: true, walk });
  };

  const handleLocationClick = (postcode) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(postcode + ' UK')}`;
    window.open(googleSearchUrl, '_blank');
  };

  const handleMeetClick = (what3words, type) => {
    const cleanW3W = what3words.replace(/^\/\/\//, '');

    if (type === 'web') {
      const w3wUrl = `https://what3words.com/${cleanW3W}`;
      window.open(w3wUrl, '_blank');
    } else if (type === 'app') {
      const appUrl = `intent://what3words.com/${cleanW3W}#Intent;scheme=https;package=com.what3words.android;end`;
      window.location.href = appUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16">
        <Helmet>
          <title>Walk Discovery Dashboard - Walk Viewer</title>
          <meta name="description" content="Discover and join local group hiking events with calendar integration and location services" />
        </Helmet>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading walks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16">
        <Helmet>
          <title>Walk Discovery Dashboard - Walk Viewer</title>
          <meta name="description" content="Discover and join local group hiking events with calendar integration and location services" />
        </Helmet>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load walks</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Helmet>
        <title>Walk Discovery Dashboard - Walk Viewer</title>
        <meta name="description" content="Discover and join local group hiking events with calendar integration and calendar services" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <HeroIllustration />

        <DayFilter
          selectedDays={selectedDays}
          onDayToggle={handleDayToggle}
        />

        <GroupFilter
          groups={availableGroups}
          selectedGroups={selectedGroups}
          onGroupToggle={handleGroupToggle}
        />

        <WalkCounter
          filteredCount={filteredWalks.length}
          totalCount={walks.length}
          // Pass null if lastChecked is null to avoid issues in WalkCounter's formatLastChecked
          lastChecked={lastChecked || new Date()}
          includePastWalks={includePastWalks}
          onTogglePastWalks={setIncludePastWalks}
        />

        <div className="space-y-4">
          {filteredWalks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.448M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No walks found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more walks.</p>
            </div>
          ) : (
            filteredWalks.map((walk) => (
              <WalkCard
                key={walk?.id}
                walk={walk}
                onCalendarAdd={handleCalendarAdd}
                onFacebookShare={handleFacebookShare}
                onLocationClick={handleLocationClick}
                onMeetClick={handleMeetClick}
              />
            ))
          )}
        </div>
      </div>

      <FacebookShareModal
        walk={facebookModal.walk}
        isOpen={facebookModal.isOpen}
        onClose={() => setFacebookModal({ isOpen: false, walk: null })}
      />
    </div>
  );
};

export default WalkDiscoveryDashboard;
