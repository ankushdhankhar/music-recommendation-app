import React from 'react';
import { Recommendation } from '../App';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
      <p>
        <strong>Artist:</strong> {recommendation.artist}
      </p>
      <p>
        <strong>Genre:</strong> {recommendation.genre}
      </p>
      <p className="mt-2">
        <strong>Reason:</strong> {recommendation.reason}
      </p>
      {recommendation.spotifyUrl && (
        <a href={recommendation.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 mt-3 inline-block">
          Listen on Spotify
        </a>
      )}
    </div>
  );
};

export default RecommendationCard;
