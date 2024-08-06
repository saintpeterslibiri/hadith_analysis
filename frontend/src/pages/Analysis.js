// Analysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaFilter } from 'react-icons/fa';
import RaviNameFilter from '../components/common/Filters/RaviNameFilter';
import RaviStatFilter from '../components/common/Filters/RaviStatFilter';
import '../analysis.css'

const Analysis = () => {
  const [hadiths, setHadiths] = useState([]);
  const [raviNameFilters, setRaviNameFilters] = useState([{ rank: '', name: '' }]);
  const [raviStatFilters, setRaviStatFilters] = useState([{ reliability: '', job: '', tribe: '' }]);
  const [hadithId, setHadithId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('general');

  useEffect(() => {
    fetchHadiths();
  }, []);

  const fetchHadiths = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/hadiths');
      setHadiths(response.data);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRaviNameFilterChange = (index, field, value) => {
    const newFilters = [...raviNameFilters];
    newFilters[index][field] = value;
    setRaviNameFilters(newFilters);
  };

  const handleRaviStatFilterChange = (index, field, value) => {
    const newFilters = [...raviStatFilters];
    newFilters[index][field] = value;
    setRaviStatFilters(newFilters);
  };

  const addRaviNameFilter = () => {
    if (raviNameFilters.length < 20) {
      setRaviNameFilters([...raviNameFilters, { rank: '', name: '' }]);
    }
  };

  const addRaviStatFilter = () => {
    if (raviStatFilters.length < 20) {
      setRaviStatFilters([...raviStatFilters, { reliability: '', job: '', tribe: '' }]);
    }
  };

  const removeRaviNameFilter = (index) => {
    setRaviNameFilters(raviNameFilters.filter((_, i) => i !== index));
  };

  const removeRaviStatFilter = (index) => {
    setRaviStatFilters(raviStatFilters.filter((_, i) => i !== index));
  };

  const applyFilters = () => {
    console.log("Filters applied:", { raviNameFilters, raviStatFilters, hadithId });
    // Implement the actual filter logic here
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'general':
        return <div className="chart">Genel Analiz Grafiği</div>;
      case 'reliability':
        return <div className="chart">Güvenilirlik Analizi Grafiği</div>;
      case 'job':
        return <div className="chart">Meslek Analizi Grafiği</div>;
      case 'tribe':
        return <div className="chart">Kabile Analizi Grafiği</div>;
      default:
        return null;
    }
  };

  return (
    <div className="analysis">
      <div className="filters">
        <h2>Filtreler</h2>
        <div className="filter-group">
          <div className="ravi-name-filters">
            {raviNameFilters.map((filter, index) => (
              <RaviNameFilter
                key={index}
                filter={filter}
                index={index}
                onChange={handleRaviNameFilterChange}
                onRemove={removeRaviNameFilter}
              />
            ))}
            <button onClick={addRaviNameFilter} className="add-filter-btn">
              <FaPlus/>
            </button>
          </div>
          <div className="ravi-stat-filters">
            {raviStatFilters.map((filter, index) => (
              <RaviStatFilter
                key={index}
                filter={filter}
                index={index}
                onChange={handleRaviStatFilterChange}
                onRemove={removeRaviStatFilter}
              />
            ))}
            <button onClick={addRaviStatFilter} className="add-filter-btn">
              <FaPlus />
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Hadis ID"
          value={hadithId}
          onChange={(e) => setHadithId(e.target.value)}
          className="hadith-id-input"
        />
        <button onClick={applyFilters} className="apply-filters-btn">
          <FaFilter /> Filtreleri Uygula
        </button>
      </div>
      <div className="charts">
        <h2>Hadis Analizi</h2>
        <div className="chart-buttons">
          <button onClick={() => setActiveChart('general')} className={activeChart === 'general' ? 'active' : ''}>
            Genel Analiz
          </button>
          <button onClick={() => setActiveChart('reliability')} className={activeChart === 'reliability' ? 'active' : ''}>
            Güvenilirlik Analizi
          </button>
          <button onClick={() => setActiveChart('job')} className={activeChart === 'job' ? 'active' : ''}>
            Meslek Analizi
          </button>
          <button onClick={() => setActiveChart('tribe')} className={activeChart === 'tribe' ? 'active' : ''}>
            Kabile Analizi
          </button>
        </div>
        {renderChart()}
      </div>
    </div>
  );
};

export default Analysis;
