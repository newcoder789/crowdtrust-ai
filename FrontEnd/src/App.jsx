import React, { useState } from 'react';
import CampaignForm from './Components/CampaignForm';
import CampaignResult from './Components/CampaignResult';
import { analyzeCampaign, createCampaign } from './utils/api';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCreate = (formData) => {
    console.log('Creating campaign with:', Object.fromEntries(formData.entries()));
    createCampaign(formData)
      .then(data => {
        console.log('Created campaign data:', data);
        setResult(data);
      })
      .catch(err => {
        console.error('Creation error:', err);
        setError(err.message);
      });
  };

  const handleAnalyze = (formData) => {
    console.log('Analyzing campaign with:', Object.fromEntries(formData.entries()));
    analyzeCampaign(formData)
      .then(data => {
        console.log('Analysis result:', data);
        setResult(data);
      })
      .catch(err => {
        console.error('Analysis error:', err);
        setError(err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 ml-[45%] mr-[35%] w-3xl ">
      <div className=" w-full"> 
        <h1 className="text-3xl font-bold text-gray-800 mb-6">CrowdTrust AI</h1>
        <CampaignForm onCreate={handleCreate} onAnalyze={handleAnalyze} />
        {error && (
          <p className="mt-4 text-red-500 bg-red-100 p-3 rounded-lg shadow-md">
            Error: {error}
          </p>
        )}
        {result && <CampaignResult result={result} />}
      </div>
    </div>
  );
}

export default App;