import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      axios.get(`http://localhost:8000/search/?query=${query}`)
        .then(res => setSuggestions(res.data))
        .catch(err => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for a Campaign Creator..."
        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
          {suggestions.map(org => (
            <li key={org.id} className="p-3 hover:bg-gray-100">
              <a href={`/organization/${org.id}`} className="flex items-center">
                <img src={org.logo} alt={org.name} className="w-8 h-8 mr-3 rounded-full" />
                <div>
                  <span className="font-semibold">{org.name}</span>
                  <p className="text-sm text-gray-600">{org.tagline}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;