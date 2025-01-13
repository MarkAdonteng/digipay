import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../components/Logo';

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white flex flex-col min-h-screen border-r">
      {/* Logo Section */}
      <div className="p-3">
        <div className="flex items-center space-x-2 pl-10">
          <Logo />
        </div>
        <div className="mt-4">
          <select className="w-full bg-white text-gray-700 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none hover:border-gray-300 transition-colors">
            <option>All Branches</option>
          </select>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <Link 
          to="/dashboard" 
          className={`flex items-center px-4 py-3 text-[#526484] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/dashboard') ? 'bg-[#F5F6FA]' : 'hover:bg-[#F5F6FA]'
          }`}
        >
          <i className="bi bi-grid-1x2 mr-3"></i>
          Dashboard
        </Link>
        
        <Link 
          to="/payments" 
          className={`flex items-center px-4 py-3 text-[#526484] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/payments') ? 'bg-[#F5F6FA]' : 'hover:bg-[#F5F6FA]'
          }`}
        >
          <i className="bi bi-credit-card mr-3"></i>
          Payments
        </Link>

        <Link 
          to="/invoicing" 
          className={`flex items-center px-4 py-3 text-[#526484] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/invoicing') ? 'bg-[#F5F6FA]' : 'hover:bg-[#F5F6FA]'
          }`}
        >
          <i className="bi bi-receipt mr-3"></i>
          Invoicing
          <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded animate-pulse">New</span>
        </Link>

        <Link 
          to="/customers" 
          className={`flex items-center px-4 py-3 text-[#526484] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/customers') ? 'bg-[#F5F6FA]' : 'hover:bg-[#F5F6FA]'
          }`}
        >
          <i className="bi bi-people mr-3"></i>
          Customers
        </Link>

        <Link 
          to="/sms" 
          className={`flex items-center px-4 py-3 text-[#526484] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/sms') ? 'bg-[#F5F6FA]' : 'hover:bg-[#F5F6FA]'
          }`}
        >
          <i className="bi bi-chat-dots mr-3"></i>
          SMS
        </Link>

        <div>
          <button 
            onClick={() => toggleDropdown('money')}
            className="w-full flex items-center justify-between px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200"
          >
            <span className="flex items-center">
              <i className="bi bi-cash-stack mr-3"></i>
              Money
            </span>
            <i className={`bi bi-chevron-${openDropdown === 'money' ? 'up' : 'down'} transition-transform duration-300`}></i>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openDropdown === 'money' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-[#F5F6FA] py-2 transform">
              <Link 
                to="/money/transfer" 
                className={`block px-11 py-2 text-[#526484] hover:bg-white font-medium transition-all duration-200 hover:pl-12 ${
                  isActive('/money/transfer') ? 'bg-white' : ''
                }`}
              >
                Transfer Money
              </Link>
              <Link 
                to="/money/history" 
                className={`block px-11 py-2 text-[#526484] hover:bg-white font-medium transition-all duration-200 hover:pl-12 ${
                  isActive('/money/history') ? 'bg-white' : ''
                }`}
              >
                Transaction History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto mb-6">
        <Link 
          to="/manage-business" 
          className={`flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/manage-business') ? 'bg-[#F5F6FA]' : ''
          }`}
        >
          <i className="bi bi-gear mr-3 transition-transform duration-300 hover:rotate-90"></i>
          Manage Business
        </Link>
        <Link 
          to="/help" 
          className={`flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200 ${
            isActive('/help') ? 'bg-[#F5F6FA]' : ''
          }`}
        >
          <i className="bi bi-question-circle mr-3"></i>
          Get Help
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 