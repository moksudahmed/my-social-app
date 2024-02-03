import React from 'react';
import './ImageViewer.css'; // Import your CSS file for styling

const ImageViewer = ({ imagesData }) => {
  return (
    <div className="image-grid-container">
      <div className="image-grid">
        {imagesData.map((imageData) => (
          <div key={imageData.id} className="image-item">
            <img src={`http://127.0.0.1:5000/images/${imageData.filename}`} alt="Image" />
            {/*<div className="image-info">
              <p>ID: {imageData.id}</p>
              <p>Filename: {imageData.filename}</p>
              <p>Size: {imageData.size} bytes</p>
        </div>*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
