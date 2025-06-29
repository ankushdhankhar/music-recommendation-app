import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="card text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <div>
          <h3 className="text-lg font-semibold">AI is thinking...</h3>
          <p className="text-gray-400">Analyzing your preferences to find perfect recommendations</p>
        </div>
        <div className="flex space-x-1">
          <div className="animate-pulse h-2 w-2 bg-primary-500 rounded-full delay-0"></div>
          <div className="animate-pulse h-2 w-2 bg-primary-500 rounded-full delay-100"></div>
          <div className="animate-pulse h-2 w-2 bg-primary-500 rounded-full delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
