import SpotifyWebApi from 'spotify-web-api-js';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string };
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  images: Array<{ url: string }>;
  followers: { total: number };
}

export interface SpotifyListeningData {
  topTracks: SpotifyTrack[];
  topArtists: Array<{
    id: string;
    name: string;
    genres: string[];
    popularity: number;
  }>;
  recentlyPlayed: SpotifyTrack[];
  audioFeatures: {
    avgEnergy: number;
    avgValence: number;
    avgDanceability: number;
    avgTempo: number;
  };
}

class SpotifyService {
  private spotify: any;
  private accessToken: string | null = null;

  constructor() {
    this.spotify = new SpotifyWebApi();
  }

  // Enable demo mode for development when Spotify auth is not available
  enableDemoMode(): void {
    this.accessToken = 'demo_mode';
    localStorage.setItem('spotify_demo_mode', 'true');
    localStorage.setItem('spotify_access_token', 'demo_mode');
  }

  // Check if demo mode is enabled
  isDemoMode(): boolean {
    return localStorage.getItem('spotify_demo_mode') === 'true' || this.accessToken === 'demo_mode';
  }

  // Spotify OAuth setup
  getAuthUrl(): string {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('Spotify Client ID not configured. Please add REACT_APP_SPOTIFY_CLIENT_ID to your .env file.');
    }

    const redirectUri = (typeof window !== 'undefined' ? window.location.origin : process.env.REACT_APP_SPOTIFY_REDIRECT_URI) || 'http://localhost:3000';

    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative'
    ];

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes.join(' '))}&` +
      `show_dialog=true`;

    return authUrl;
  }

  // Set access token from OAuth callback
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.spotify.setAccessToken(token);
    localStorage.setItem('spotify_access_token', token);
  }

  // Get stored access token
  getStoredToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('spotify_access_token');
      if (this.accessToken) {
        this.spotify.setAccessToken(this.accessToken);
      }
    }
    return this.accessToken;
  }

  // Check if user is authenticated (real auth takes priority over demo)
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!(token && token !== 'demo_mode');
  }

  // Check if demo mode is active
  isInDemoMode(): boolean {
    return this.isDemoMode() && !this.isAuthenticated();
  }

  // Logout
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_demo_mode');
  }

  // Get user profile
  async getUserProfile(): Promise<SpotifyUserProfile> {
  const token = this.getStoredToken(); // load from localStorage
  if (!token || token === 'demo_mode') {
    console.warn('No valid access token found.');
    throw new Error('No valid Spotify access token found');
  }

  this.spotify.setAccessToken(token); // Ensure it’s set

  try {
    const profile = await this.spotify.getMe();
    console.log('Fetched Spotify profile:', profile);
    return {
      id: profile.id,
      display_name: profile.display_name || 'User',
      images: profile.images || [],
      followers: profile.followers || { total: 0 }
    };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw new Error(
      error?.body?.error?.message || 'Failed to fetch user profile'
    );
  }
}


  // Get demo user profile
  private getDemoUserProfile(): SpotifyUserProfile {
    return {
      id: 'demo_user',
      display_name: 'Demo User',
      images: [],
      followers: { total: 42 }
    };
  }

  // Get comprehensive listening data
  async getUserListeningData(): Promise<SpotifyListeningData> {
    if (this.isDemoMode()) {
      return this.getDemoListeningData();
    }

    try {
      // Fetch top tracks and artists in parallel
      const [topTracksResponse, topArtistsResponse, recentlyPlayedResponse] = await Promise.all([
        this.spotify.getMyTopTracks({ limit: 20, time_range: 'medium_term' }),
        this.spotify.getMyTopArtists({ limit: 20, time_range: 'medium_term' }),
        this.spotify.getMyRecentlyPlayedTracks({ limit: 20 })
      ]);

      const topTracks = topTracksResponse.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_urls: track.external_urls
      }));

      const topArtists = topArtistsResponse.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity
      }));

      const recentlyPlayed = recentlyPlayedResponse.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        album: item.track.album,
        popularity: item.track.popularity,
        preview_url: item.track.preview_url,
        external_urls: item.track.external_urls
      }));

      // Get audio features for top tracks to understand user preferences
      const trackIds = topTracks.slice(0, 10).map((track: any) => track.id);
      const audioFeaturesResponse = await this.spotify.getAudioFeaturesForTracks(trackIds);
      
      const audioFeatures = this.calculateAverageAudioFeatures(audioFeaturesResponse.audio_features);

      return {
        topTracks,
        topArtists,
        recentlyPlayed,
        audioFeatures
      };
    } catch (error) {
      console.error('Error fetching listening data:', error);
      throw new Error('Failed to fetch listening data');
    }
  }

  // Get demo listening data for development
  private getDemoListeningData(): SpotifyListeningData {
    return {
      topTracks: [
        {
          id: 'demo1',
          name: 'Blinding Lights',
          artists: [{ name: 'The Weeknd' }],
          album: { name: 'After Hours' },
          popularity: 95,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/0VjIjW4GlULA4LGoDOEz2t' }
        },
        {
          id: 'demo2',
          name: 'Anti-Hero',
          artists: [{ name: 'Taylor Swift' }],
          album: { name: 'Midnights' },
          popularity: 92,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu' }
        },
        {
          id: 'demo3',
          name: 'As It Was',
          artists: [{ name: 'Harry Styles' }],
          album: { name: "Harry's House" },
          popularity: 90,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/4Dvkj6JhhA12EX05fT7y2e' }
        }
      ],
      topArtists: [
        {
          id: 'artist1',
          name: 'The Weeknd',
          genres: ['pop', 'r&b', 'electronic'],
          popularity: 95
        },
        {
          id: 'artist2',
          name: 'Taylor Swift',
          genres: ['pop', 'country', 'indie'],
          popularity: 98
        },
        {
          id: 'artist3',
          name: 'Dua Lipa',
          genres: ['pop', 'dance', 'electronic'],
          popularity: 88
        }
      ],
      recentlyPlayed: [
        {
          id: 'recent1',
          name: 'Flowers',
          artists: [{ name: 'Miley Cyrus' }],
          album: { name: 'Endless Summer Vacation' },
          popularity: 89,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/0yLdNVWF3Srea0uzk55zFn' }
        }
      ],
      audioFeatures: {
        avgEnergy: 0.75,
        avgValence: 0.65,
        avgDanceability: 0.8,
        avgTempo: 125
      }
    };
  }

  // Calculate average audio features
  private calculateAverageAudioFeatures(features: any[]): SpotifyListeningData['audioFeatures'] {
    const validFeatures = features.filter(f => f !== null);
    
    if (validFeatures.length === 0) {
      return {
        avgEnergy: 0.5,
        avgValence: 0.5,
        avgDanceability: 0.5,
        avgTempo: 120
      };
    }

    const totals = validFeatures.reduce(
      (acc, feature) => ({
        energy: acc.energy + feature.energy,
        valence: acc.valence + feature.valence,
        danceability: acc.danceability + feature.danceability,
        tempo: acc.tempo + feature.tempo
      }),
      { energy: 0, valence: 0, danceability: 0, tempo: 0 }
    );

    return {
      avgEnergy: totals.energy / validFeatures.length,
      avgValence: totals.valence / validFeatures.length,
      avgDanceability: totals.danceability / validFeatures.length,
      avgTempo: totals.tempo / validFeatures.length
    };
  }

  // Search for tracks
  async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    try {
      const response = await this.spotify.searchTracks(query, { limit });
      return response.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_urls: track.external_urls
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw new Error('Failed to search tracks');
    }
  }

  // Get track by ID
  async getTrack(trackId: string): Promise<SpotifyTrack> {
    try {
      const track = await this.spotify.getTrack(trackId);
      return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_urls: track.external_urls
      };
    } catch (error) {
      console.error('Error fetching track:', error);
      throw new Error('Failed to fetch track');
    }
  }
}

export const spotifyService = new SpotifyService();
