import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Mail, CalendarClock
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-primary-50 text-primary-700 font-semibold border-l-4 border-primary-600' 
            : 'text-secondary-700 hover:bg-gray-50 hover:text-primary-600 border-l-4 border-transparent'
        }`
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Define sidebar items based on user role
  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/scheduling', icon: <CalendarClock size={20} />, text: 'Scheduling' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
  ];
  
  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/scheduling', icon: <CalendarClock size={20} />, text: 'Scheduling' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
  ];
  
  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  
  // Common items at the bottom
  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];
  
  return (
    <div className="w-64 bg-white h-full border-r border-gray-100 hidden md:flex md:flex-col shadow-sm">
      <div className="flex-1 py-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="px-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              to={item.to}
              icon={item.icon}
              text={item.text}
            />
          ))}
        </div>
        
        {/* Settings Section */}
        <div className="mt-8 px-4">
          <h3 className="px-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">
            Other
          </h3>
          <div className="space-y-1">
            {commonItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Support Section */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-transparent to-gray-50">
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-primary-600" />
            <p className="text-xs font-semibold text-secondary-900">Need Help?</p>
          </div>
          <p className="text-xs text-secondary-600 mb-3">Get in touch with our support team</p>
          <a 
            href="mailto:support@businessnexus.com" 
            className="inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-700 hover:gap-1 transition-all duration-200"
          >
            support@businessnexus.com →
          </a>
        </div>
      </div>
    </div>
  );
};