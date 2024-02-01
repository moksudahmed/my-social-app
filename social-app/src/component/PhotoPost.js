import React, { useState } from 'react';

const PhotoPost = ({ onPost }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    // Handle file change and update the selectedFile state
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handlePostClick = () => {
    // Check if a file is selected before posting
    if (selectedFile) {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      // Call the onPost function passed as a prop with the selected file
      console.log(formData);
      onPost('photo', formData);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handlePostClick}>Post Photo</button>
    </div>
  );
};

export default PhotoPost;
