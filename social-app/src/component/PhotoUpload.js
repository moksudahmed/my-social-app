import React, { useState } from 'react';

const PhotoUpload = ({ onPost , accessToken, fetchPosts }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    // Handle file change and update the selectedFiles state
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if files are selected before posting
    if (selectedFiles.length > 0) {
      const formData = new FormData();

      // Append each selected file to the formData
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(`images`, selectedFiles[i]);
      }
      
      try {
        // Assuming you have an API endpoint for posting photos
        const response = await fetch('http://127.0.0.1:5000/posts/photo', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          console.log('Photos uploaded successfully');
          // Clear selectedFiles after posting
          setSelectedFiles([]);
          fetchPosts();
        } else {
          console.error('Failed to upload photos');
        }
      } catch (error) {
        console.error('Error during photo upload:', error);
      }
    } else {
      console.error('No file selected');
    }
  };
  const handleFormSubmit2 = (e) => {
    // Check if files are selected before posting
    if (selectedFiles.length > 0) {
        const formData = new FormData();
  
        // Append each selected file to the formData
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append(`images`, selectedFiles[i]);
        }
        const jsonFormData = {};
        for (let i = 0; i < selectedFiles.length; i++) {

            jsonFormData[i] = selectedFiles[i];
          }
      
      
      // Call the onUpload function passed as a prop with the JSON object
      //onPost('photo',jsonFormData);
      // Call the onPost function passed as a prop with the selected files
      //console.log(formData); // Log to check if FormData is populated
      onPost(formData);

      // Clear selectedFiles after posting
      setSelectedFiles([]);
    } else {
      console.error('No file selected');
    }
  };

  
  return (
    <div>
      <h1>Image Upload</h1>
      <form encType="multipart/form-data">
        <label htmlFor="images">Select Images:</label>
        <input
          type="file"
          name="images"
          id="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          required
        />
        <br />
        <button type="button" onClick={handleFormSubmit}>
          Upload Images
        </button>
      </form>
    </div>
  );
};

export default PhotoUpload;
