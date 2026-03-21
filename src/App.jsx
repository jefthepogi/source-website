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
import AdminApp from './components/AdminPanel';

function HomePage() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isMentorsDay = location.pathname === '/mentorsday';
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminApp />;
  }

  return (
    // ← removed data-theme="light" — that was causing DaisyUI to force a white background
    <div style={{ minHeight: '100vh', background: '#0d0f0e' }}>
      {!isMentorsDay && <Navbar />}

      <Routes>
        {/* HomePage hero slides under the transparent navbar intentionally — no offset needed */}
        <Route path="/" element={<HomePage />} />
        {/* All other pages need 60px top padding to clear the fixed navbar */}
        <Route path="/officers" element={<div style={{ paddingTop: 60 }}><OfficersPage /></div>} />
        <Route path="/events"   element={<div style={{ paddingTop: 60 }}><EventsPage /></div>} />
        <Route path="/contacts" element={<div style={{ paddingTop: 60 }}><ContactsPage /></div>} />
        <Route path="/merch"    element={<div style={{ paddingTop: 60 }}><MerchPage /></div>} />
        <Route path="/letsdebug" element={<div style={{ paddingTop: 60 }}><CodeSnippetsPage /></div>} />
        <Route path="/mentorsday" element={<MentorsDay />} />
        <Route path="/*" element={<FlexibleRedirect />} />
      </Routes>

      {!isMentorsDay && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
