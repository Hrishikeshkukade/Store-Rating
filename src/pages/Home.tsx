import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Users, Search, Shield } from 'lucide-react';
import Button from '../components/shared/Button';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { currentUser, isAdmin, isStoreOwner } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-fluid py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover and Rate the Best Stores
              </h1>
              <p className="text-lg md:text-xl text-primary-50 mb-8">
                Join our community to find quality stores based on real customer reviews and share your own experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/stores">
                  <Button size="lg" variant="accent">
                    Browse Stores
                  </Button>
                </Link>
                
                {!currentUser && (
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Sign Up Free
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 bg-white/10 rounded-full absolute animate-pulse-subtle"></div>
                <div className="relative z-10">
                  <Store className="w-64 h-64 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose StoreRatings?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to discover high-quality stores and share your experiences with the community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Honest Ratings</h3>
              <p className="text-gray-600">
                All ratings come from verified users who have actually visited the stores, ensuring authentic feedback.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-accent-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Discovery</h3>
              <p className="text-gray-600">
                Find stores by name, location, or rating to quickly discover the best options near you.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-secondary-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-gray-600">
                We prioritize the security of your data and maintain a safe environment for all users.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-fluid">
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-800 rounded-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Rating Stores?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users sharing their shopping experiences and helping others find the best stores.
            </p>
            
            {!currentUser ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" variant="accent">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button size="lg" variant="accent">
                      Go to Admin Dashboard
                    </Button>
                  </Link>
                )}
                
                {isStoreOwner && (
                  <Link to="/store-owner/dashboard">
                    <Button size="lg" variant="accent">
                      Go to Store Dashboard
                    </Button>
                  </Link>
                )}
                
                {!isAdmin && !isStoreOwner && (
                  <Link to="/stores">
                    <Button size="lg" variant="accent">
                      Browse Stores
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-fluid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <p className="text-gray-600">Registered Stores</p>
            </div>
            
            <div className="p-8">
              <div className="text-4xl font-bold text-accent-500 mb-2">10,000+</div>
              <p className="text-gray-600">User Ratings</p>
            </div>
            
            <div className="p-8">
              <div className="text-4xl font-bold text-secondary-600 mb-2">5,000+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;