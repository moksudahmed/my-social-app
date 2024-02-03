import React, { useState } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    //const selectedFiles = e.target.files;
    setSelectedFiles(e.target.files);
    
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Check if files are selected before posting
    if (selectedFiles.length > 0) {
      const formData = new FormData();
  
      // Append each selected file to the formData
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(`photo${i + 1}`,'test');
      }
      var formData1 = new FormData();
        formData1.append('title', 'title');
        formData1.append('body', 'body');
        formData1.append('image', 'image');
      // Convert FormData to a JSON object
      const jsonFormData = {};
      formData.forEach((value, key) => {
        jsonFormData[key] = value;
      });
      console.log(formData1);
      // Call the onUpload function passed as a prop with the JSON object
      onUpload(jsonFormData);
  
      // Clear selectedFiles after posting
      setSelectedFiles([]);
    } else {
      console.error('No file selected');
    }
  };
  
  const handleFormSubmit2 = (e) => {
    e.preventDefault();
    // You can perform additional actions before or after submitting the form if needed
    // For example, you might want to validate the selected files or show a loading indicator
    // Then, call the onUpload function to handle the upload
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <label htmlFor="images">Select Images:</label>
        <input type="file" name="images" id="images" accept="image/*" multiple required onChange={handleFileChange} />
        <br />
        <button type="submit">Upload Images</button>
      </form>
    </div>
  );
};

export default ImageUpload;
