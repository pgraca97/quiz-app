import React, { useContext } from "react";
import { UserContext } from './UserContext';

const Results = ({ element, artwork }) => {
  const { name } = useContext(UserContext);
  
  return (
    <div className="results">
      <h2>Quiz Complete!</h2>
      <p>
        <strong>{name}</strong>, your element is: <strong>{element}</strong>
      </p>
      {artwork ? (
        <div className="artwork">
          <h3>{artwork.title}</h3>
          <img 
            src={artwork.primaryImage} 
            alt={artwork.title} 
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/600x400?text=${element}+Element`;
            }}
          />
          <div className="artwork-details">
            <p><strong>Artist:</strong> {artwork.artistDisplayName || 'Unknown'}</p>
            <p><strong>Date:</strong> {artwork.objectDate || 'Unknown'}</p>
            <p><strong>Medium:</strong> {artwork.medium || 'Unknown'}</p>
            <p><strong>Department:</strong> {artwork.department || 'Unknown'}</p>
          </div>
          <a 
            href={artwork.objectURL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="met-link"
          >
            View on Met Museum Website →
          </a>
        </div>
      ) : (
        <p>Loading your elemental artwork from the Met Museum...</p>
      )}
    </div>
  );
};

export default Results;