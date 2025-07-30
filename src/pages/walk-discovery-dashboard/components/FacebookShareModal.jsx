import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const FacebookShareModal = ({ walk, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !walk) return null; // Add !walk check for safety

  const generateFacebookText = () => {
    const date = new Date(walk.walk_date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const time = new Date(walk.walk_date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    let text = `🥾 Join us for a group walk!\n\n`;
    text += `📍 ${walk.title}\n`;
    
    // Add Group Name
    if (walk.group_name) {
      text += `👥 Group: ${walk.group_name}\n`;
    }

    text += `📅 ${date} at ${time}\n`;
    text += `📏 Distance: ${walk.distance}\n`; // Removed 'miles' as per previous discussion

    if (walk.difficulty) {
      text += `⚡ Difficulty: ${walk.difficulty}\n`;
    }
    
    if (walk.description) {
      // Sanitize description here as well, just in case
      text += `\n${walk.description.replace(/\\'/g, "'")}\n`;
    }
    
    if (walk.postcode) {
      text += `\n📍 Location: ${walk.postcode}\n`;
    }
    
    if (walk.what3words) {
      text += `🎯 Meet point: ${walk.what3words}\n`;
    }

    // Add Details URL
    if (walk.details_url) {
      text += `🔗 Full Details: ${walk.details_url}\n`;
    }
    
    text += `\n#GroupWalk #Hiking #OutdoorActivity`;
    
    return text;
  };

  const handleCopy = () => {
    // Create a temporary textarea element to copy text from
    const textarea = document.createElement('textarea');
    textarea.value = generateFacebookText();
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page
    textarea.style.opacity = '0'; // Hide it
    document.body.appendChild(textarea);
    textarea.select(); // Select the text

    try {
      // Use document.execCommand('copy') for broader compatibility in iframes
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Failed to copy text using execCommand.');
        // Fallback or user instruction if copy fails
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    } finally {
      document.body.removeChild(textarea); // Clean up the temporary element
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Share on Facebook</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Copy this text and paste it into your Facebook post:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
              {generateFacebookText()}
            </pre>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="default"
              onClick={handleCopy}
              iconName={copied ? "Check" : "Copy"}
              className="flex-1"
            >
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookShareModal;
