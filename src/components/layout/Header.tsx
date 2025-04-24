import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Store, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/auth-service';
import Button from '../shared/Button';

const Header: React.FC = () => {
  const { currentUser, userData, isAdmin, isStoreOwner } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-fluid">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-primary-600 flex items-center">
            <Store className="h-6 w-6 mr-2" />
            <span>StoreRatings</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Admin Dashboard
                  </Link>
                )}
                {isStoreOwner && (
                  <Link to="/store-owner/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Store Dashboard
                  </Link>
                )}
                <Link to="/stores" className="text-gray-700 hover:text-primary-600 transition">
                  Stores
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-primary-600 transition">
                    <span className="mr-1">{userData?.name?.split(' ')[0] || 'User'}</span>
                    <User className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/update-password" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Update Password
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="container px-4 py-3">
            {currentUser ? (
              <>
                <div className="py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center py-3 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Admin Dashboard
                  </Link>
                )}
                {isStoreOwner && (
                  <Link 
                    to="/store-owner/dashboard" 
                    className="flex items-center py-3 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Store className="h-5 w-5 mr-3" />
                    Store Dashboard
                  </Link>
                )}
                <Link 
                  to="/stores" 
                  className="flex items-center py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store className="h-5 w-5 mr-3" />
                  Stores
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                <Link 
                  to="/update-password" 
                  className="flex items-center py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Update Password
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full py-3 text-gray-700"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;