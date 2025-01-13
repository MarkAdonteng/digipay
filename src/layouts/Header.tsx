import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b">
      <h1 className="text-xl font-medium">{getPageTitle()}</h1>
      
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
  );
};

export default Header; 