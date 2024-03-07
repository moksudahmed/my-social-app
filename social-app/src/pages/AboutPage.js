import React from 'react';
import './AboutPage.css'; // Import CSS file for styling

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-heading">Welcome to Our About Page</h1>
        <p className="about-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hendrerit, nulla sed efficitur
          fermentum, sem leo posuere arcu, non consequat magna magna et nisi. Vivamus tempus lectus id leo
          consectetur, ac consectetur justo congue. In hac habitasse platea dictumst. Fusce sit amet magna
          eget nulla lacinia rhoncus.
        </p>
        <p className="about-description">
          Integer vel congue nulla. Mauris feugiat faucibus magna, id tincidunt lectus pharetra sed. Nullam
          sit amet eros in enim fermentum rutrum at vitae elit. Nulla facilisi. Suspendisse in ante sed nibh
          condimentum varius. Aliquam erat volutpat. Vestibulum rutrum velit a dui placerat, ut dapibus felis
          scelerisque.
        </p>
        <p className="about-description">
          Proin suscipit nulla id libero rutrum, non tempus ex dapibus. Sed tempus felis et orci placerat
          posuere. Integer gravida, dolor eu consequat ullamcorper, dui velit mattis leo, eget volutpat eros
          tortor in tellus.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
