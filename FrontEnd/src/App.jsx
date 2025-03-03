import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './Pages/SearchPage';
import OrganizationPage from './Pages/OrganizationPage';
import Proposal from './Pages/Proposal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-screen">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/organization/:orgId" element={<OrganizationPage />} />
          <Route path="/Proposal" element={<Proposal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;