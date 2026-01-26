import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Header from './components/Header';
import Body from './components/Body';
import OfficersPage from './components/OfficersPage';
import EventsPage from './components/EventsPage';
import ContactsPage from './components/ContactsPage';
import MerchPage from './components/MerchPage';
import CodeSnippetsPage from './components/DebugCode';
import FlexibleRedirect from './components/FlexibleRedirect';
import MentorsDay from './components/MentorsDay';

function HomePage() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}

// 1. Create a wrapper component to handle the logic
function AppContent() {
  const location = useLocation();
  
  // Check if current page is Mentors Day
  const isMentorsDay = location.pathname === '/mentorsday';

  return (
    <div className="App" data-theme="light">
      {/* 2. Hide Navbar and Footer if isMentorsDay is true */}
      {!isMentorsDay && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/officers" element={<OfficersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/letsdebug" element={<CodeSnippetsPage />} />
        <Route path="/mentorsday" element={<MentorsDay />} />
        
        {/* Catch-all route for dynamic redirects */}
        <Route path="/*" element={<FlexibleRedirect />} />
      </Routes>

      {!isMentorsDay && <Footer />}
    </div>
  );
}

// 3. Keep the Router at the top level
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;