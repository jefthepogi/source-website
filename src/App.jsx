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

function CCSEAMonthRedirect() {
  React.useEffect(() => {
    console.log("Redirecting to CCSEA Month form...");
    window.location.replace('https://forms.gle/7s6bzGHpDk13cYwF9'); // Use replace() instead of href
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg">Redirecting to CCSEA Month Participant Form...</p>
    </div>
  );
}


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
          <Route path="/ccsea-month" element={<CCSEAMonthRedirect />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;