import { UserPreferences, Recommendation } from '../App';
import { SpotifyListeningData, spotifyService } from './spotifyService';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const getMusicRecommendations = async (preferences: UserPreferences, useSpotifyData: boolean = false): Promise<Recommendation[]> => {
  let spotifyData: SpotifyListeningData | null = null;
  
  // Fetch Spotify data if user is authenticated and wants to use it
  if (useSpotifyData && spotifyService.isAuthenticated()) {
    try {
      spotifyData = await spotifyService.getUserListeningData();
    } catch (error) {
      console.error('Failed to fetch Spotify data:', error);
    }
  }
  
  // Use Groq AI for recommendations if API key is available
  if (process.env.REACT_APP_GROQ_API_KEY) {
    try {
      return await getGroqRecommendations(preferences, spotifyData);
    } catch (error) {
      console.error('Groq API failed, falling back to mock data:', error);
    }
  }
  
  // Fallback to mock recommendations
  const recommendations = spotifyData 
    ? generateSpotifyBasedRecommendations(preferences, spotifyData)
    : generateMockRecommendations(preferences);
    
  return recommendations;
};

// Mock function to generate recommendations based on preferences
// Replace this with actual OpenAI API call in production
const generateMockRecommendations = (preferences: UserPreferences): Recommendation[] => {
  const { genres, mood, energy, favoriteArtists } = preferences;
  
  const recommendations: Recommendation[] = [];
  
  // Generate recommendations based on genres and mood
  if (genres.includes('Rock') && mood === 'Energetic') {
    recommendations.push({
      title: "Don't Stop Believin'",
      artist: "Journey",
      genre: "Rock",
      reason: `Perfect for your energetic mood! This classic rock anthem matches your love for ${genres.join(', ')} music.`
    });
  }
  
  if (genres.includes('Pop') && (mood === 'Happy' || mood === 'Energetic')) {
    recommendations.push({
      title: "Levitating",
      artist: "Dua Lipa",
      genre: "Pop",
      reason: `This upbeat pop hit is perfect for your ${mood.toLowerCase()} mood and high energy preferences.`
    });
  }
  
  if (genres.includes('Hip Hop') && energy === 'High') {
    recommendations.push({
      title: "HUMBLE.",
      artist: "Kendrick Lamar",
      genre: "Hip Hop",
      reason: "A high-energy hip hop track that matches your preference for intense, powerful music."
    });
  }
  
  if (genres.includes('Electronic') && mood === 'Chill') {
    recommendations.push({
      title: "Midnight City",
      artist: "M83",
      genre: "Electronic",
      reason: "This electronic masterpiece creates the perfect chill atmosphere while maintaining engaging energy."
    });
  }
  
  if (genres.includes('Jazz') && (mood === 'Calm' || mood === 'Peaceful')) {
    recommendations.push({
      title: "Take Five",
      artist: "Dave Brubeck",
      genre: "Jazz",
      reason: "A timeless jazz classic that perfectly captures peaceful, contemplative moods."
    });
  }
  
  if (genres.includes('Indie') && mood === 'Nostalgic') {
    recommendations.push({
      title: "Such Great Heights",
      artist: "The Postal Service",
      genre: "Indie Electronic",
      reason: "This indie gem evokes nostalgic feelings with its dreamy soundscape and heartfelt lyrics."
    });
  }
  
  // Add recommendations based on favorite artists
  if (favoriteArtists.toLowerCase().includes('taylor swift')) {
    recommendations.push({
      title: "Anti-Hero",
      artist: "Taylor Swift",
      genre: "Pop",
      reason: "Since you mentioned Taylor Swift as a favorite, this recent hit showcases her evolving sound."
    });
  }
  
  if (favoriteArtists.toLowerCase().includes('beatles')) {
    recommendations.push({
      title: "Here Comes the Sun",
      artist: "The Beatles",
      genre: "Rock",
      reason: "A perfect Beatles track that matches your preference for uplifting, timeless music."
    });
  }
  
  // Fallback recommendations if nothing specific matches
  if (recommendations.length === 0) {
    recommendations.push(
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        genre: "Pop",
        reason: `Based on your ${mood.toLowerCase()} mood and ${energy.toLowerCase()} energy preference, this hit should be perfect!`
      },
      {
        title: "Good as Hell",
        artist: "Lizzo",
        genre: "Pop/R&B",
        reason: "This empowering anthem matches your music taste and current vibe."
      }
    );
  }
  
  // Limit to 3-4 recommendations
  return recommendations.slice(0, Math.min(4, recommendations.length));
};

// Generate recommendations based on Spotify listening data
const generateSpotifyBasedRecommendations = (preferences: UserPreferences, spotifyData: SpotifyListeningData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const { topArtists, recentlyPlayed, audioFeatures } = spotifyData;
  
  // Analyze user's music taste from Spotify data
  const topGenres = extractTopGenres(topArtists);
  const energyProfile = analyzeEnergyProfile(audioFeatures, preferences.energy);
  
  // Generate recommendations based on top artists and similar styles
  topArtists.slice(0, 3).forEach((artist, index) => {
    const similarTrack = findSimilarTrackRecommendation(artist, preferences.mood, energyProfile);
    if (similarTrack) {
      recommendations.push({
        title: similarTrack.title,
        artist: similarTrack.artist,
        genre: artist.genres[0] || 'Unknown',
        reason: `Based on your love for ${artist.name} (${artist.genres.slice(0, 2).join(', ')}), this ${preferences.mood.toLowerCase()} track matches your ${preferences.energy.toLowerCase()} energy preference.`,
        spotifyUrl: similarTrack.spotifyUrl
      });
    }
  });
  
  // Add recommendations based on audio features
  if (energyProfile.isHighEnergy && preferences.mood === 'Energetic') {
    recommendations.push({
      title: "Pump It Up",
      artist: "Elvis Costello",
      genre: "Rock",
      reason: `Your Spotify data shows you love high-energy tracks (avg energy: ${(audioFeatures.avgEnergy * 100).toFixed(0)}%). This energetic rock anthem should be perfect!`
    });
  }
  
  if (audioFeatures.avgValence > 0.6 && preferences.mood === 'Happy') {
    recommendations.push({
      title: "Happy",
      artist: "Pharrell Williams",
      genre: "Pop",
      reason: `Your listening history shows a preference for positive, upbeat music (avg happiness: ${(audioFeatures.avgValence * 100).toFixed(0)}%). This feel-good hit is right up your alley!`
    });
  }
  
  // Recommend based on recent listening patterns
  if (recentlyPlayed.length > 0) {
    const recentArtist = recentlyPlayed[0].artists[0].name;
    recommendations.push({
      title: "Discover Weekly Pick",
      artist: "Similar to " + recentArtist,
      genre: topGenres[0] || 'Mixed',
      reason: `Since you recently listened to ${recentArtist}, here's a similar artist that matches your current ${preferences.mood.toLowerCase()} mood.`
    });
  }
  
  return recommendations.slice(0, 4);
};

// Extract top genres from user's top artists
const extractTopGenres = (topArtists: SpotifyListeningData['topArtists']): string[] => {
  const genreCount: { [key: string]: number } = {};
  
  topArtists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });
  
  return Object.entries(genreCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);
};

// Analyze energy profile
const analyzeEnergyProfile = (audioFeatures: SpotifyListeningData['audioFeatures'], preferredEnergy: string) => {
  return {
    isHighEnergy: audioFeatures.avgEnergy > 0.6,
    isUpbeat: audioFeatures.avgValence > 0.5,
    isDanceable: audioFeatures.avgDanceability > 0.6,
    averageTempo: audioFeatures.avgTempo,
    matchesPreference: 
      (preferredEnergy === 'High' && audioFeatures.avgEnergy > 0.6) ||
      (preferredEnergy === 'Medium' && audioFeatures.avgEnergy >= 0.3 && audioFeatures.avgEnergy <= 0.7) ||
      (preferredEnergy === 'Low' && audioFeatures.avgEnergy < 0.4)
  };
};

// Find similar track recommendation based on artist and mood
const findSimilarTrackRecommendation = (artist: any, mood: string, energyProfile: any) => {
  // This would ideally call Spotify's recommendation API or use a music database
  // For demo purposes, we'll return mock similar tracks
  const similarTracks = {
    'Taylor Swift': {
      title: 'Lavender Haze',
      artist: 'Taylor Swift',
      spotifyUrl: 'https://open.spotify.com/track/5jQI2r1RdgtuT8S3iG8zFC'
    },
    'The Weeknd': {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlULA4LGoDOEz2t'
    },
    'Dua Lipa': {
      title: 'Physical',
      artist: 'Dua Lipa',
      spotifyUrl: 'https://open.spotify.com/track/3IAUNFFcR85QR5PNzHN0yq'
    }
  };
  
  return similarTracks[artist.name as keyof typeof similarTracks] || null;
};

// Groq AI API integration for enhanced recommendations
const getGroqRecommendations = async (preferences: UserPreferences, spotifyData?: SpotifyListeningData | null): Promise<Recommendation[]> => {
  let prompt = `You are a music recommendation expert. Based on these preferences, suggest 3-4 specific songs:

User Preferences:
- Genres: ${preferences.genres.join(', ')}
- Current Mood: ${preferences.mood}
- Energy Level: ${preferences.energy}
- Recently Listened: ${preferences.recentlyListened || 'Not specified'}
- Favorite Artists: ${preferences.favoriteArtists || 'Not specified'}`;
  
  if (spotifyData) {
    const topArtists = spotifyData.topArtists.slice(0, 5).map(a => a.name).join(', ');
    const topTracks = spotifyData.topTracks.slice(0, 3).map(t => `"${t.name}" by ${t.artists[0].name}`).join(', ');
    const avgEnergy = (spotifyData.audioFeatures.avgEnergy * 100).toFixed(0);
    const avgValence = (spotifyData.audioFeatures.avgValence * 100).toFixed(0);
    const topGenres = extractTopGenres(spotifyData.topArtists).slice(0, 3).join(', ');
    
    prompt += `

Spotify Listening Data:
- Top Artists: ${topArtists}
- Recent Top Tracks: ${topTracks}
- Favorite Genres: ${topGenres}
- Average Energy Level: ${avgEnergy}% (0-100)
- Average Positivity: ${avgValence}% (0-100)
- Average Tempo: ${spotifyData.audioFeatures.avgTempo.toFixed(0)} BPM`;
  }
  
  prompt += `

Provide recommendations as a JSON array with this exact format:
[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "genre": "Genre",
    "reason": "Why this matches their taste and current mood"
  }
]

Ensure recommendations match their mood (${preferences.mood}) and energy level (${preferences.energy}). Include both popular and lesser-known tracks that fit their taste.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const recommendations: Recommendation[] = JSON.parse(jsonMatch[0]);
    
    // Add Spotify URLs if possible
    return recommendations.map(rec => ({
      ...rec,
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(rec.title + ' ' + rec.artist)}`
    }));
    
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
};
