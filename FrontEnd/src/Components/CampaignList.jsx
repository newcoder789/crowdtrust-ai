import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/campaigns')
      .then(res => {
        console.log('Campaigns loaded:', res.data);
        setCampaigns(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Loading campaigns...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns yet—create one above!</p>
      ) : (
        campaigns.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{c.name}</h2>
            <p>{c.description}</p>
            <p>{c.detail}</p>
            <img src={c.uiImage} alt="Display" className="w-32 h-32 object-cover mt-2" />
            <img src={c.aiCheckImage} alt="Proof" className="w-32 h-32 object-cover mt-2" />
            <p>Goal: {c.goal} ETH</p>
            <p>Fraud Reported: {c.fraudReported ? 'Yes' : 'No'} | Trust Score: {c.trustScore}</p>
            <p className={c.fraudReported ? 'text-red-500' : 'text-green-500'}>AI Comment: {c.aiComment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CampaignList;