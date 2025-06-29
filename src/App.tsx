import React, { useState } from 'react';
import MusicForm from './components/MusicForm';
import RecommendationCard from './components/RecommendationCard';
import LoadingSpinner from './components/LoadingSpinner';
import SpotifyIntegration from './components/SpotifyIntegration';
import { getMusicRecommendations } from './services/aiService';

export interface UserPreferences {
  genres: string[];
  mood: string;
  energy: string;
  recentlyListened: string;
  favoriteArtists: string;
}

export interface Recommendation {
  title: string;
  artist: string;
  genre: string;
  reason: string;
  spotifyUrl?: string;
}

const App: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const handleGetRecommendations = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const newRecommendations = await getMusicRecommendations(preferences, spotifyConnected);
      setRecommendations(newRecommendations);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifyAuthChange = (isAuthenticated: boolean) => {
    setSpotifyConnected(isAuthenticated);
    // Clear previous recommendations when auth status changes
    if (!isAuthenticated) {
      setRecommendations([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎵 AI Music Recommender
          </h1>
          <p className="text-gray-300 text-lg">
            Discover your next favorite song with AI-powered recommendations
          </p>
        </div>

        {/* Spotify Integration */}
        <div className="max-w-4xl mx-auto mb-8">
          <SpotifyIntegration onAuthChange={handleSpotifyAuthChange} />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <MusicForm onSubmit={handleGetRecommendations} loading={loading} spotifyConnected={spotifyConnected} />
            </div>

            {/* Results Section */}
            <div>
              {loading && <LoadingSpinner />}
              
              {error && (
                <div className="card bg-red-900 border-red-700">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              {recommendations.length > 0 && !loading && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Your Recommendations</h2>
                  {recommendations.map((rec, index) => (
                    <RecommendationCard key={index} recommendation={rec} />
                  ))}
                </div>
              )}

              {recommendations.length === 0 && !loading && !error && (
                <div className="card text-center">
                  <div className="text-6xl mb-4">🎶</div>
                  <h3 className="text-xl font-semibold mb-2">Ready to discover new music?</h3>
                  <p className="text-gray-400">
                    Fill out your preferences on the left to get personalized recommendations!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

