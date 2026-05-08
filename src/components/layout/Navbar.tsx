import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bell, MessageCircle, User, LogOut, Building2, CircleDollarSign, CalendarClock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // User dashboard route based on role
  const dashboardRoute = user?.role === 'entrepreneur' 
    ? '/dashboard/entrepreneur' 
    : '/dashboard/investor';
  
  // User profile route based on role and ID
  const profileRoute = user 
    ? `/profile/${user.role}/${user.id}` 
    : '/login';
  
  const navLinks = [
    {
      icon: user?.role === 'entrepreneur' ? <Building2 size={18} /> : <CircleDollarSign size={18} />,
      text: 'Dashboard',
      path: dashboardRoute,
    },
    {
      icon: <MessageCircle size={18} />,
      text: 'Messages',
      path: user ? '/messages' : '/login',
    },
    {
      icon: <CalendarClock size={18} />,
      text: 'Scheduling',
      path: user ? '/scheduling' : '/login',
    },
    {
      icon: <Bell size={18} />,
      text: 'Notifications',
      path: user ? '/notifications' : '/login',
    },
    {
      icon: <User size={18} />,
      text: 'Profile',
      path: profileRoute,
    }
  ];
  
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Business Nexus</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {user ? (
              <>
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <span className="mr-1.5">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}
              </>
            ) : null}
          </div>
          
          {/* Right side actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {user ? (
              <>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                >
                  Logout
                </Button>
                
                <div className="h-8 w-px bg-gray-200"></div>
                
                <Link to={profileRoute} className="flex items-center space-x-2 ml-1 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors duration-200">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? 'online' : 'offline'}
                  />
                  <span className="text-sm font-medium text-secondary-900">{user.name}</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="btn-icon text-secondary-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-gray-50 mb-2">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? 'online' : 'offline'}
                  />
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{user.name}</p>
                    <p className="text-xs text-secondary-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-2 space-y-1">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="flex items-center px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.text}
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="btn-menu text-base text-secondary-700 hover:text-error-600 hover:bg-error-50"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link 
                  to="/login" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" fullWidth size="sm">Log in</Button>
                </Link>
                <Link 
                  to="/register" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button fullWidth size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};