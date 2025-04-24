import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center text-xl font-bold text-primary-600 mb-4">
              <Store className="h-6 w-6 mr-2" />
              <span>StoreRatings</span>
            </Link>
            <p className="text-gray-600 mb-4">
              The trusted platform for honest store ratings and reviews.
              Discover the best places to shop based on real customer experiences.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/stores" className="text-gray-600 hover:text-primary-600 transition">
                  Browse Stores
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-600 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-primary-600 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} StoreRatings. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;