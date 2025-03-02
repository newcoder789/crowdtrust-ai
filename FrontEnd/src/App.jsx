import React, { useState } from 'react';
import CampaignForm from './Components/CampaignForm';
import CampaignResult from './Components/CampaignResult';
import { analyzeCampaign, createCampaign } from './api';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCreate = async (formData) => {
    try {
      setError(null);
      const data = await createCampaign(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnalyze = async (formData) => {
    try {
      setError(null);
      const data = await analyzeCampaign(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">CrowdTrust AI</h1>
      <CampaignForm onCreate={handleCreate} onAnalyze={handleAnalyze} />
      {error && (
        <p className="mt-4 text-red-500 bg-red-100 p-3 rounded-lg shadow-md">
          Error: {error}
        </p>
      )}
      {result && <CampaignResult result={result} />}
    </div>
  );
}

export default App;