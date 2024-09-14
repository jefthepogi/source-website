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
        </Routes>
        <Footer />
      </div>
    </Router>
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

export default App;
