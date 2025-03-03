import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      setError(null);
      axios.get(`http://localhost:5000/search/?query=${encodeURIComponent(query)}`)
        .then(res => {
          setSuggestions(res.data || []);
        })
        .catch(err => {
          console.error('Search error:', err);
          setError('Failed to fetch search results. Please try again.');
          setSuggestions([]);
        })
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [query]);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow-md animate-fadeIn">
        Discover Creators & Campaigns
      </h1>

      <div className="relative w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for creators or campaigns..."
          className="w-full p-4 border rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out text-gray-800 placeholder-gray-400"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="loading loading-spinner loading-sm text-blue-500"></span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-center text-red-500 font-medium animate-pulse">{error}</p>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-6 max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 divide-y divide-gray-100 animate-slideUp">
          {suggestions.map((item) => (
            <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              <a
                href={
                  item.type === "organization"
                    ? `/organization/${item.id}`
                    : `/campaign/${item.id}`
                }
                className="flex items-center gap-4 group"
              >
                <img
                  src={item.logo || item.uiImage}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-transform transform group-hover:scale-105"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.name} ({item.type})
                  </span>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.tagline || item.description}
                  </p>
                </div>
                <span className="text-blue-500 text-sm font-medium group-hover:underline">
                  View
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {suggestions.length === 0 && !loading && query.length > 2 && (
        <p className="mt-4 text-center text-gray-500">No results found for "{query}"</p>
      )}
    </div>
  );
};

// Add Tailwind animations (optional, ensure tailwind.config.js includes these)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
  .animate-slideUp { animation: slideUp 0.5s ease-out; }
`;

export default SearchPage;