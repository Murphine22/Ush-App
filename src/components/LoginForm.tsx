import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Church, Loader2, Shield, Crown, ChevronDown } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState<'announcement_admin' | 'full_admin'>('announcement_admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password, accessLevel);
      if (!success) {
        setError('Invalid credentials for the selected access level');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCredentialsForLevel = (level: 'announcement_admin' | 'full_admin') => {
    if (level === 'announcement_admin') {
      return {
        email: 'digcusheringdepartment@gmail.com',
        password: '08037812417'
      };
    } else {
      return {
        email: 'elishaejimofor@gmail.com',
        password: 'Murphine2408'
      };
    }
  };

  const handleAccessLevelChange = (level: 'announcement_admin' | 'full_admin') => {
    setAccessLevel(level);
    const credentials = getCredentialsForLevel(level);
    setEmail(credentials.email);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Church className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Administrator Login
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            DIGC Ushering Department Finance Portal
          </p>
        </div>

        {/* Access Level Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <label className="block text-sm font-medium text-white mb-3">
            Select Access Level:
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleAccessLevelChange('announcement_admin')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                accessLevel === 'announcement_admin'
                  ? 'border-blue-400 bg-blue-500/20 shadow-lg'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Shield className={`h-6 w-6 ${accessLevel === 'announcement_admin' ? 'text-blue-300' : 'text-white/70'}`} />
                <div>
                  <h3 className={`font-semibold ${accessLevel === 'announcement_admin' ? 'text-blue-200' : 'text-white'}`}>
                    Announcement Admin
                  </h3>
                  <p className={`text-sm ${accessLevel === 'announcement_admin' ? 'text-blue-300' : 'text-white/70'}`}>
                    Manage announcements and updates only
                  </p>
                  <p className="text-xs text-yellow-300 mt-1">
                    Email: digcusheringdepartment@gmail.com
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAccessLevelChange('full_admin')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                accessLevel === 'full_admin'
                  ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Crown className={`h-6 w-6 ${accessLevel === 'full_admin' ? 'text-purple-300' : 'text-white/70'}`} />
                <div>
                  <h3 className={`font-semibold ${accessLevel === 'full_admin' ? 'text-purple-200' : 'text-white'}`}>
                    Full Administrator
                  </h3>
                  <p className={`text-sm ${accessLevel === 'full_admin' ? 'text-purple-300' : 'text-white/70'}`}>
                    Complete access to all system features
                  </p>
                  <p className="text-xs text-yellow-300 mt-1">
                    Email: elishaejimofor@gmail.com
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Access Level Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              {accessLevel === 'announcement_admin' ? (
                <Shield className="h-5 w-5 text-blue-300" />
              ) : (
                <Crown className="h-5 w-5 text-purple-300" />
              )}
              <h3 className="text-sm font-medium">
                Selected: {accessLevel === 'announcement_admin' ? 'Announcement Admin' : 'Full Administrator'}
              </h3>
            </div>
            <div className="text-xs text-white/80">
              {accessLevel === 'announcement_admin' ? (
                <div>
                  <p>• Access to announcements and updates management</p>
                  <p>• View-only access to financial data</p>
                  <p>• Cannot modify financial records or member dues</p>
                </div>
              ) : (
                <div>
                  <p>• Complete administrative access</p>
                  <p>• Full financial management capabilities</p>
                  <p>• Member dues and payment management</p>
                  <p>• All announcement and update features</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  {accessLevel === 'announcement_admin' ? (
                    <Shield className="h-5 w-5 mr-2" />
                  ) : (
                    <Crown className="h-5 w-5 mr-2" />
                  )}
                  Sign in as {accessLevel === 'announcement_admin' ? 'Announcement Admin' : 'Full Administrator'}
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-blue-100 text-sm">
              Select your access level above and use the corresponding credentials
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;