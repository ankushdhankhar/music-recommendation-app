import React, { useState } from 'react';
import { UserPreferences } from '../App';

interface MusicFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  loading: boolean;
  spotifyConnected: boolean;
}

const MusicForm: React.FC<MusicFormProps> = ({ onSubmit, loading, spotifyConnected }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    mood: '',
    energy: '',
    recentlyListened: '',
    favoriteArtists: ''
  });

  const genres = [
  // Western
  'Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical',
  'Country', 'R&B', 'Indie', 'Alternative', 'Folk', 'Reggae',
  // Indian
  'Punjabi', 'Haryanvi', 'Bollywood', 'Desi Pop', 'Bhangra', 'Indian Hip Hop'
];


  const moods = [
    'Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Nostalgic', 
    'Motivated', 'Chill', 'Angry', 'Peaceful'
  ];

  const energyLevels = ['Low', 'Medium', 'High'];

  const handleGenreChange = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.genres.length > 0 && preferences.mood && preferences.energy) {
      onSubmit(preferences);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Tell us about your music taste</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Genres */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Preferred Genres (select multiple)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreChange(genre)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  preferences.genres.includes(genre)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium mb-3">Current Mood</label>
          <select
            value={preferences.mood}
            onChange={(e) => setPreferences(prev => ({ ...prev, mood: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select your mood</option>
            {moods.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium mb-3">Energy Level</label>
          <div className="flex gap-2">
            {energyLevels.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setPreferences(prev => ({ ...prev, energy: level }))}
                className={`flex-1 p-3 rounded-lg transition-colors ${
                  preferences.energy === level
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Recently Listened */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Recently Listened (song or artist)
          </label>
          <input
            type="text"
            value={preferences.recentlyListened}
            onChange={(e) => setPreferences(prev => ({ ...prev, recentlyListened: e.target.value }))}
            placeholder="e.g., Bohemian Rhapsody by Queen"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Favorite Artists */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Favorite Artists (comma separated)
          </label>
          <input
            type="text"
            value={preferences.favoriteArtists}
            onChange={(e) => setPreferences(prev => ({ ...prev, favoriteArtists: e.target.value }))}
            placeholder="e.g., The Beatles, Taylor Swift, Kendrick Lamar"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading || preferences.genres.length === 0 || !preferences.mood || !preferences.energy}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Getting Recommendations...' : spotifyConnected ? 'Get AI Recommendations (Spotify Enhanced) 🎵' : 'Get AI Recommendations 🎵'}
        </button>
        
        {spotifyConnected && (
          <div className="mt-3 p-3 bg-green-900/30 border border-green-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm">
                Spotify integration enabled - recommendations will be based on your listening history!
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MusicForm;
