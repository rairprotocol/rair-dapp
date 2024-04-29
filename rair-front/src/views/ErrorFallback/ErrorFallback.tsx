import React from 'react';

export const ErrorFallback: React.FC = () => {
  return (
    <div className="not-found-page">
      <h3>
        <span className="text-404">Sorry!</span>
      </h3>
      <p>An error has ocurred</p>
    </div>
  );
};
