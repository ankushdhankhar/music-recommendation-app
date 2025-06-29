import { UserPreferences, Recommendation } from '../App';

// Note: In production, use environment variables for the API key
// const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const getMusicRecommendations = async (preferences: UserPreferences): Promise<Recommendation[]> => {
  // For demo purposes, we'll create mock recommendations based on preferences
  // In a real app, you would call the OpenAI API here
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockRecommendations = generateMockRecommendations(preferences);
  return mockRecommendations;
};

// Mock function to generate recommendations based on preferences
// Replace this with actual OpenAI API call in production
const generateMockRecommendations = (preferences: UserPreferences): Recommendation[] => {
  const { genres, mood, energy, recentlyListened, favoriteArtists } = preferences;
  
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

// Function to call actual OpenAI API (commented out for demo)
/*
const callOpenAIAPI = async (preferences: UserPreferences): Promise<Recommendation[]> => {
  const prompt = `Based on these music preferences:
- Genres: ${preferences.genres.join(', ')}
- Mood: ${preferences.mood}
- Energy: ${preferences.energy}
- Recently listened: ${preferences.recentlyListened}
- Favorite artists: ${preferences.favoriteArtists}

Suggest 3-4 specific songs with artist names, genres, and reasons why they match the preferences. Format as JSON array with title, artist, genre, and reason fields.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const recommendations = JSON.parse(content);
    return recommendations;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI recommendations');
  }
};
*/
