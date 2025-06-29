# 🎵 AI Music Recommender

A responsive web application that uses AI to provide personalized music recommendations based on user preferences, mood, and listening habits.

## Features

- **🎯 Personalized Recommendations**: AI-powered suggestions based on genres, mood, energy level, and listening history
- **📱 Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **⚡ Real-time Analysis**: Instant processing of user preferences to generate tailored recommendations
- **🎨 Modern UI**: Dark theme with gradient backgrounds and smooth animations
- **🔧 TypeScript**: Type-safe development for better code quality and maintainability

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API (GPT)
- **Build Tool**: Create React App
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (optional for demo mode)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd music-recommendation-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for full AI integration):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and visit `http://localhost:3000`

## Usage

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

## AI Integration

The app currently includes:
- **Mock AI Service**: Demonstrates intelligent recommendation logic based on user preferences
- **OpenAI Integration Ready**: Commented code for easy integration with OpenAI's GPT API
- **Extensible Architecture**: Easy to add more AI providers or recommendation algorithms

To enable full OpenAI integration:
1. Uncomment the `callOpenAIAPI` function in `src/services/aiService.ts`
2. Replace the mock service call with the actual API call
3. Add your OpenAI API key to the environment variables

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
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- 🎵 Spotify/Apple Music integration for direct playback
- 📊 User listening history tracking
- 🤝 Social features for sharing recommendations
- 📈 Advanced analytics and recommendation tracking
- 🔗 Integration with more music streaming platforms
- 🎤 Voice input for hands-free interaction

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
