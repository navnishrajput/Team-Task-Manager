import { Bell, Search, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to projects page with search
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {!isAuthPage && (
          <button onClick={toggleSidebar} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu size={20} className="text-gray-600" />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-56 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={19} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user ? (
          <div className="relative" ref={ref}>
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
              <span className={`hidden md:inline text-xs px-2 py-0.5 rounded-full font-medium ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={() => { setShowProfile(false); navigate('/dashboard'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <User size={15} /> Profile
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Login</button>
            <button onClick={() => navigate('/signup')} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;