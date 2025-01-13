import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface User {
  username: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      {/* Sidebar */}
      <div className="w-64 bg-white flex flex-col min-h-screen border-r">
        {/* Logo Section */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
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
          <a href="#" className="flex items-center px-4 py-3 text-[#526484] bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-grid-1x2 mr-3"></i>
            Dashboard
          </a>
          
          <a href="#" className="flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-credit-card mr-3"></i>
            Payments
          </a>

          <a href="#" className="flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-receipt mr-3"></i>
            Invoicing
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded animate-pulse">New</span>
          </a>

          <a href="#" className="flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-people mr-3"></i>
            Customers
          </a>

          <a href="#" className="flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-chat-dots mr-3"></i>
            SMS
          </a>

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
                <a href="#" className="block px-11 py-2 text-[#526484] hover:bg-white font-medium transition-all duration-200 hover:pl-12">
                  Transfer Money
                </a>
                <a href="#" className="block px-11 py-2 text-[#526484] hover:bg-white font-medium transition-all duration-200 hover:pl-12">
                  Transaction History
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="mt-auto mb-6">
          <a href="#" className="flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-gear mr-3 transition-transform duration-300 hover:rotate-90"></i>
            Manage Business
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-[#526484] hover:bg-[#F5F6FA] font-medium transform hover:translate-x-1 transition-all duration-200">
            <i className="bi bi-question-circle mr-3"></i>
            Get Help
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white h-16 flex items-center justify-between px-6 border-b">
          <h1 className="text-xl font-medium">Dashboard</h1>
          
          <div className="flex items-center space-x-6">
            <button className="px-4 py-2 bg-[#00C9A7] text-white rounded flex items-center space-x-2 hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105">
              <span>CREATE NEW</span>
              <i className="bi bi-chevron-down transition-transform duration-200 group-hover:rotate-180"></i>
            </button>

            <div className="relative cursor-pointer hover:scale-110 transition-transform duration-200">
              <i className="bi bi-bell text-xl text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>

            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <div className="text-right">
                <p className="text-sm font-medium">Yayra Tamakloe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Yayra+Tamakloe" alt="User" className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <p className="text-sm text-gray-600 mb-6">
            Your snapshot for today, 18th November, 2024 at 3:01PM (Accra / GMT)
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
              <p className="text-lg font-medium">GHS 0.00</p>
              <p className="text-sm text-gray-500">Gross payments</p>
            </div>

            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
              <p className="text-lg font-medium">GHS 0.00</p>
              <p className="text-sm text-gray-500">Total refunds</p>
            </div>

            <div className="bg-[#00C9A7] text-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
              <p className="text-lg font-medium">GHS 0.00</p>
              <p className="text-sm">Net payments</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 text-center transform transition-all duration-300 hover:shadow-lg">
            <img src="/images/no-data.svg" alt="No data" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-gray-500">
              You are seeing this because there is no data yet for this set period.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 