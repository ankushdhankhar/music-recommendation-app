import React, { useState, useEffect } from 'react';
import { spotifyService, SpotifyUserProfile } from '../services/spotifyService';

interface SpotifyIntegrationProps {
  onAuthChange: (isAuthenticated: boolean) => void;
}

const SpotifyIntegration: React.FC<SpotifyIntegrationProps> = ({ onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = spotifyService.isAuthenticated();
    setIsAuthenticated(authenticated);
    onAuthChange(authenticated);

    if (authenticated) {
      fetchUserProfile();
    }

    // Handle OAuth callback
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = () => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.split('&')[0].split('=')[1];
      if (token) {
        spotifyService.setAccessToken(token);
        setIsAuthenticated(true);
        onAuthChange(true);
        fetchUserProfile();
        // Clean up URL
        window.location.hash = '';
      }
    }
  };

  const fetchUserProfile = async () => {
  setLoading(true);
  try {
    console.log('Attempting to fetch Spotify user profile...');
    const profile = await spotifyService.getUserProfile();
    setUserProfile(profile);
    console.log('Spotify profile:', profile);
  } catch (err: any) {
    setError(err.message || 'Failed to fetch user profile');
    console.error('User profile fetch error:', err);
  } finally {
    setLoading(false);
  }
};


  const handleLogin = () => {
    try {
      const authUrl = spotifyService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      setError('Failed to start Spotify authentication. Check your configuration.');
    }
  };


  const handleLogout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setUserProfile(null);
    onAuthChange(false);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          <span>Loading Spotify profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Connect to Spotify</h3>
            <p className="text-gray-400 text-sm">
              Get AI recommendations based on your actual listening history
            </p>
          </div>
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {userProfile?.images && userProfile.images.length > 0 ? (
              <img
                src={userProfile.images[0].url}
                alt={userProfile.display_name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {userProfile?.display_name || 'Spotify User'}
            </h3>
            <p className="text-green-400 text-sm">
              ✓ Connected to Spotify
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
        >
          Disconnect
        </button>
      </div>
      
      {error && (
        <div className="mt-3 p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpotifyIntegration;
