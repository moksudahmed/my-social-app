import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      <h3 className="search-results-heading">Search Results</h3>
      <ul className="search-results-list">
        {results.map((user) => (
          <li key={user.user_id} className="search-results-item">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
