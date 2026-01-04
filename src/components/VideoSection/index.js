import React from 'react';
import './VideoSection.css';

const VideoSection = ({ videoId, title, description }) => {
  return (
    <div className="video-section-container">
      <div className="video-section-content">
        {title && <h2 className="video-title">{title}</h2>}
        {description && <p className="video-description">{description}</p>}

        <div className="video-wrapper">
          <iframe
            className="video-iframe"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title || "Video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
