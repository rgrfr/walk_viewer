import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const FacebookShareModal = ({ walk, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
    text += `📅 ${date} at ${time}\n`;
    text += `📏 Distance: ${walk.distance} miles\n`;
    
    if (walk.difficulty) {
      text += `⚡ Difficulty: ${walk.difficulty}\n`;
    }
    
    if (walk.description) {
      text += `\n${walk.description}\n`;
    }
    
    if (walk.postcode) {
      text += `\n📍 Location: ${walk.postcode}\n`;
    }
    
    if (walk.what3words) {
      text += `🎯 Meet point: ${walk.what3words}\n`;
    }
    
    text += `\n#GroupWalk #Hiking #OutdoorActivity`;
    
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFacebookText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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