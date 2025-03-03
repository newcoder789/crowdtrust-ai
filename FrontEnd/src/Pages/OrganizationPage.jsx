// src/pages/OrganizationPage.js (unchanged, but verify)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const OrganizationPage = () => {
  const { orgId } = useParams();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/organization/${orgId}`)
      .then(res => {
        console.log('Organization loaded:', res.data);
        setOrg(res.data)})
      .catch(err => {
        console.error('Organization error:', err.message);
        setError(`Failed to fetch organization: ${err.message}. Check backend at http://localhost:5000`);
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!org) return <div className="text-center p-6">Organization not found</div>;

  const successData = [
    { name: 'Completed', value: org.campaigns.filter(c => c.status === "Completed").length },
    { name: 'Active', value: org.campaigns.filter(c => c.status === "Active").length },
    { name: 'Failed', value: org.campaigns.filter(c => c.status === "Failed").length },
  ];

  const barData = org.campaigns.map(c => ({
    name: c.name.slice(0, 10) + '...',
    funds: c.funds_raised
  }));

  return (
    <div className="container mx-auto p-6 h-screen overflow-y-auto text-black ">
      <div className="flex items-center mb-6">
        <img src={org.logo} alt={org.name} className="w-16 h-16 mr-4 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold">{org.name}</h1>
          <p className="text-gray-600">{org.tagline}</p>
        </div>
      </div>
      <div className="mb-6">
        <p><strong>Wallet:</strong> {org.wallet_address}</p>
        <p><strong>Email:</strong> {org.contact.email}</p>
        <p><strong>Phone:</strong> {org.contact.phone}</p>
        <a href={org.contact.whatsapp} className="text-blue-500">Join WhatsApp</a>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Donate Now</button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">History</h2>
        <p className="mt-2 text-gray-700">{org.history}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Latest Report</h2>
        <p className="mt-2 text-gray-700">{org.last_creator_report}</p>
        {org.report_insights && (
          <div className="mt-2">
            <p><strong>Activity:</strong> {org.report_insights.activity}</p>
            <p><strong>Outcome:</strong> {org.report_insights.outcome}</p>
            <p><strong>Challenge:</strong> {org.report_insights.challenge}</p>
            <p><strong>Sentiment:</strong> {org.report_insights.sentiment}%</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {org.campaigns.map(campaign => (
            <div key={campaign._id} className="border p-4 rounded-lg shadow-sm">
              <img src={campaign.uiImage} alt={campaign.name} className="w-full h-32 object-cover rounded" />
              <h3 className="text-xl font-semibold mt-2">{campaign.name}</h3>
              <p>{campaign.description}</p>
              <p><strong>Goal:</strong> ${campaign.goal}</p>
              <p><strong>Raised:</strong> ${campaign.funds_raised}</p>
              <p><strong>Status:</strong> {campaign.status}</p>
              {campaign.insights && (
                <div className="mt-2">
                  <p><strong>Activity:</strong> {campaign.insights.activity}</p>
                  <p><strong>Outcome:</strong> {campaign.insights.outcome}</p>
                  <p><strong>Challenge:</strong> {campaign.insights.challenge}</p>
                  <p><strong>Sentiment:</strong> {campaign.insights.sentiment}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold">Campaign Status</h3>
            <PieChart width={300} height={200}>
              <Pie data={successData} dataKey="value" nameKey="name" fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Funds Raised</h3>
            <BarChart width={300} height={200} data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="funds" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;