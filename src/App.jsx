import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function HomePage() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App" data-theme="light">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/officers" element={<OfficersPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/letsdebug" element={<CodeSnippetsPage />} />
          
          {/* Catch-all route for dynamic redirects */}
          <Route path="/*" element={<FlexibleRedirect />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;