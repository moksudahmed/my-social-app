import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div>
      <h3>Search Results</h3>
      <ul>
        {results.map((user) => (
          <li key={user.user_id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
