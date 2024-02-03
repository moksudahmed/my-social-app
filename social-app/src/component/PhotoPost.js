import React, { useState } from 'react';

const PhotoPost = ({ onPost }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    // Handle file change and update the selectedFiles state
    setSelectedFiles(e.target.files);
  };

  const handlePostClick = () => {
    // Check if files are selected before posting
    if (selectedFiles.length > 0) {
      const formData = new FormData();

      // Append each selected file to the formData
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(`photo${i + 1}`, selectedFiles[i]);
      }

      // Call the onPost function passed as a prop with the selected files
      console.log(formData); // Log to check if FormData is populated
      onPost('photo', formData);

      // Clear selectedFiles after posting
      setSelectedFiles([]);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} name="images" id="images" accept="image/*" multiple required />
      <button onClick={handlePostClick}>Post Photo</button>
    </div>
  );
};

export default PhotoPost;
