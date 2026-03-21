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

  // Admin panel has its own full-screen layout
  if (isAdmin) {
    return <AdminApp />;
  }

  return (
    <div className="App" data-theme="light">
      {!isMentorsDay && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/officers" element={<OfficersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/letsdebug" element={<CodeSnippetsPage />} />
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
        {/* Admin panel - full screen, no Navbar/Footer */}
        <Route path="/admin/*" element={<AdminApp />} />
        {/* Rest of the site */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
