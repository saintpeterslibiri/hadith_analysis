import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RaviList from './pages/RaviList';
import HadithsList from './pages/HadithsList';
import Navbar from './components/common/Navbar';
import 'leaflet/dist/leaflet.css';
import Charts from './pages/Charts';
import Analysis from './pages/Analysis';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ravis" element={<RaviList />} />
        <Route path="/hadiths" element={<HadithsList />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;