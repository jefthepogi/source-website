import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Header from './components/Header';
import Body from './components/Body';
import OfficersPage from './components/OfficersPage';

function App() {
  return (
    <Router>
      <div className="App" data-theme="light">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/officers" element={<OfficersPage />} />
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
