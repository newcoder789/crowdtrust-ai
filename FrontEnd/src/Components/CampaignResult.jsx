import React from 'react';

const CampaignResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Campaign Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Name:</strong> {result.name || 'N/A'}</p>
          <p className="text-gray-700"><strong>Description:</strong> {result.description || 'N/A'}</p>
          <p className="text-gray-700"><strong>Goal:</strong> {result.goal} ETH</p>
          <p className="text-gray-700"><strong>Raised Funds:</strong> {result.raised_funds} ETH</p>
          <p className="text-gray-700"><strong>Verified:</strong> {result.verification_status ? 'Yes' : 'No'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Fraud Score:</strong> {result.fraud_score?.toFixed(2) || 'N/A'}%</p>
          <p className="text-gray-700"><strong>Risk Report:</strong> {result.risk_report || 'None'}</p>
          <p className="text-gray-700"><strong>Appeal Outcome:</strong> {result.appeal_outcome || 'N/A'}</p>
          <p className="text-gray-700"><strong>Suggested Action:</strong> {result.suggested_action || 'N/A'}</p>
          {result.anomaly_flags?.length > 0 && (
            <p className="text-gray-700"><strong>Anomalies:</strong> {result.anomaly_flags.join(', ') || 'None'}</p>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {result.uiImage && (
          <div>
            <p className="text-sm font-medium text-gray-700">UI Image</p>
            <img
              // src={result.uiImage.replace(/\\/g, '/').replace(/ /g, '%20')}
              src="https://res.cloudinary.com/dysuze5eq/image/upload/v1740943465/1740838029.257427-food_eating_child_lh9r0h.webp"
              alt="UI"
              className="w-full h-auto rounded-lg object-cover shadow-md"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
              }}
            />
          </div>
        )}
        {result.aiCheckImage && (
          <div>
            <p className="text-sm font-medium text-gray-700">AI Check Image</p>
            <img
              // src={result.aiCheckImage.replace(/\\/g, '/').replace(/ /g, '%20')}
              src ="https://res.cloudinary.com/dysuze5eq/image/upload/v1740943481/1740837402.940626-supply_hall_f5ox6w.webp"
              alt="AI Check"
              className="w-full h-auto rounded-lg object-cover shadow-md"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignResult;