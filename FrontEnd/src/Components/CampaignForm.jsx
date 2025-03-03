import React, { useState } from 'react';

const CampaignForm = ({ onCreate, onAnalyze }) => {
  const [mode, setMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    campaign_id: '',
    description: '',
    goal: '',
    verificationStatus: false,
    proposal: '',
    donor: '',
    appeal: '',
    uiImage: null,
    aiCheckImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    if (mode === 'create') {
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('goal', formData.goal);
      data.append('verificationStatus', formData.verificationStatus);
      console.log('Creating campaign with:', Object.fromEntries(data.entries()));
      onCreate(data);
    } else {
      data.append('campaign_id', formData.campaign_id);
      data.append('proposal', formData.proposal);
      data.append('donor', formData.donor);
      data.append('appeal', formData.appeal);
      if (formData.uiImage) data.append('uiImage', formData.uiImage);
      if (formData.aiCheckImage) data.append('aiCheckImage', formData.aiCheckImage);

      console.log('Sending FormData to /analyze:', Object.fromEntries(data.entries()));
      onAnalyze(data); // Only pass formData to App.js, let it handle the fetch
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {mode === 'create' ? 'Create New Campaign' : 'Analyze Proposal'}
      </h2>
      <button
        type="button"
        onClick={() => setMode(mode === 'create' ? 'analyze' : 'create')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Switch to {mode === 'create' ? 'Analyze Proposal' : 'Create Campaign'}
      </button>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {mode === 'create' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Rebuilding Rural Schools"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="e.g., Help us renovate schools in rural areas."
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Goal (ETH)</label>
              <input
                type="number"
                name="goal"
                placeholder="e.g., 2500"
                value={formData.goal}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700">Verified</label>
              <input
                type="checkbox"
                name="verificationStatus"
                checked={formData.verificationStatus}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </>
        )}
        {mode === 'analyze' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign ID</label>
            <input
              type="text"
              name="campaign_id"
              placeholder="e.g., 67c315f53c34d0ae7dd4935b"
              value={formData.campaign_id}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Proposal (JSON)</label>
          <input
            type="text"
            name="proposal"
            placeholder='e.g., {"amount_requested": 1500, "reason": "Buy desks"}'
            value={formData.proposal}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Donor (JSON)</label>
          <input
            type="text"
            name="donor"
            placeholder='e.g., {"donation_history": [{"amount": 1000, "timestamp": "2025-02-27"}]}'
            value={formData.donor}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Appeal (JSON)</label>
          <input
            type="text"
            name="appeal"
            placeholder='e.g., {"creator_response": "Shipping delays increased costs"}'
            value={formData.appeal}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">UI Image</label>
          <input
            type="file"
            name="uiImage"
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">AI Check Image</label>
          <input
            type="file"
            name="aiCheckImage"
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {mode === 'create' ? 'Create Campaign' : 'Analyze Proposal'}
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;