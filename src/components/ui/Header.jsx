import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Walk Discovery',
      path: '/walk-discovery-dashboard',
      icon: 'MapPin'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Mountain" size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-foreground">Walk Viewer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth touch-target ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" iconName="Bell" className="touch-target">
            Notifications
          </Button>
          <Button variant="ghost" size="sm" iconName="User" className="touch-target">
            Profile
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          iconName={isMobileMenuOpen ? "X" : "Menu"}
          onClick={toggleMobileMenu}
          className="md:hidden touch-target"
        >
          Menu
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border shadow-active">
          <nav className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-smooth touch-target ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-3 mt-3 border-t border-border space-y-1">
              <button className="flex items-center space-x-3 px-3 py-3 w-full text-left rounded-lg text-sm font-medium text-text-secondary hover:text-foreground hover:bg-muted transition-smooth touch-target">
                <Icon name="Bell" size={20} />
                <span>Notifications</span>
              </button>
              <button className="flex items-center space-x-3 px-3 py-3 w-full text-left rounded-lg text-sm font-medium text-text-secondary hover:text-foreground hover:bg-muted transition-smooth touch-target">
                <Icon name="User" size={20} />
                <span>Profile</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;