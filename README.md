# 🎵 AI Music Recommender

A responsive web application that uses AI to provide personalized music recommendations based on user preferences, mood, and listening habits.

## Features

- **🎯 Personalized Recommendations**: AI-powered suggestions based on genres, mood, energy level, and listening history
- **🎵 Spotify Integration**: Connect your Spotify account to get recommendations based on your actual listening data
- **📊 Audio Analysis**: Uses Spotify's audio features (energy, valence, danceability) for precise recommendations
- **📱 Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **⚡ Real-time Analysis**: Instant processing of user preferences to generate tailored recommendations
- **🎨 Modern UI**: Dark theme with gradient backgrounds and smooth animations
- **🔧 TypeScript**: Type-safe development for better code quality and maintainability

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Music API**: Spotify Web API
- **AI Integration**: Groq API (Llama 3)
- **Build Tool**: Create React App
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spotify Developer Account (for Spotify integration)
- Groq API key (optional for enhanced AI recommendations)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd music-recommendation-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Spotify App** (required for Spotify integration):
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app (choose "Web API" as the app type)
   - In "Redirect URIs", add: `http://localhost:3000`
   - Copy your Client ID from the app settings

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your credentials:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   ```
   
   **Important**: Make sure your Spotify app settings have `http://localhost:3000` as a redirect URI

5. **Start the development server**:
   ```bash
   npm start
   ```

6. **Open your browser** and visit `http://localhost:3000`

## Usage

### With Spotify Integration (Recommended)
1. **Connect to Spotify** by clicking the "Connect Spotify" button
2. **Authorize the app** to access your listening data
3. **Fill out your current preferences** (the form will auto-enhance with your Spotify data)
4. **Get AI recommendations** based on your actual listening history

### Without Spotify
1. **Select your preferred genres** by clicking on the genre buttons
2. **Choose your current mood** from the dropdown menu
3. **Set your energy level** (Low, Medium, High)
4. **Optional**: Add recently listened songs and favorite artists
5. **Click "Get AI Recommendations"** to receive personalized suggestions

## Project Structure

```
src/
├── components/
│   ├── MusicForm.tsx          # User preference form
│   ├── RecommendationCard.tsx # Individual recommendation display
│   └── LoadingSpinner.tsx     # Loading animation
├── services/
│   └── aiService.ts           # AI recommendation logic
├── App.tsx                    # Main application component
├── index.tsx                  # React entry point
└── index.css                  # Tailwind CSS imports and custom styles
```

## Spotify Integration

The app leverages Spotify's Web API to:
- **Fetch Top Tracks & Artists**: Analyzes your most-played music
- **Get Recently Played**: Uses your recent listening for fresh recommendations
- **Audio Feature Analysis**: Examines energy, valence, danceability, and tempo
- **Genre Mapping**: Extracts genres from your favorite artists
- **Personalized Recommendations**: Combines AI with your actual music taste

## AI Integration

The app includes:
- **Groq AI Integration**: Fast AI recommendations using Llama 3 model
- **Spotify-Enhanced AI**: Uses your listening data for more accurate recommendations
- **Smart Fallbacks**: Falls back to intelligent mock recommendations if AI is unavailable
- **Extensible Architecture**: Easy to add more AI providers or recommendation algorithms

To enable Groq AI:
1. Get a free API key from [Groq Console](https://console.groq.com/)
2. Add `REACT_APP_GROQ_API_KEY` to your environment variables
3. The app automatically uses AI when the key is available

## Customization

### Adding New Genres
Edit the `genres` array in `src/components/MusicForm.tsx`:
```typescript
const genres = [
  'Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical',
  'YourNewGenre' // Add here
];
```

### Modifying Mood Options
Update the `moods` array in the same file:
```typescript
const moods = [
  'Happy', 'Sad', 'Energetic', 'Calm',
  'YourNewMood' // Add here
];
```

### Styling Changes
The app uses Tailwind CSS. Modify colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## License

MIT License - Feel free to use and modify!
