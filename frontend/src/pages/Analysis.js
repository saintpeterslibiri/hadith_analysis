import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes, FaFilter } from 'react-icons/fa';
import RaviFilter from '../components/common/RaviAnalysisFilters';

const Analysis = () => {
  const [hadiths, setHadiths] = useState([]);
  const [raviFilters, setRaviFilters] = useState([{ rank: '', name: '' }]);
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

  const handleRaviFilterChange = (index, field, value) => {
    const newFilters = [...raviFilters];
    newFilters[index][field] = value;
    setRaviFilters(newFilters);
  };

  const addRaviFilter = () => {
    if (raviFilters.length < 20) {
      setRaviFilters([...raviFilters, { rank: '', name: '' }]);
    }
  };

  const removeRaviFilter = (index) => {
    setRaviFilters(raviFilters.filter((_, i) => i !== index));
  };

  const applyFilters = () => {
    // Filtreleme mantığı burada uygulanacak
    console.log("Filters applied:", raviFilters, hadithId);
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'general':
        return <div className="chart general-chart">Genel Analiz Grafiği</div>;
      case 'reliability':
        return <div className="chart reliability-chart">Güvenilirlik Analizi Grafiği</div>;
      case 'narrators':
        return <div className="chart narrators-chart">Raviler Analizi Grafiği</div>;
      default:
        return null;
    }
  };

  return (
    <div className="analysis-dashboard">
      <h1 className="text-center text-4xl font-extrabold p-10 text-gray-700">Hadis Analyse</h1>
      <div className="analysis-content">
        <div className="filter-section">
          <h2 className="section-title">Filtreler</h2>
          <div className="ravi-filters">
            {raviFilters.map((filter, index) => (
              <RaviFilter
                key={index}
                filter={filter}
                index={index}
                onChange={handleRaviFilterChange}
                onRemove={removeRaviFilter}
              />
            ))}
            {raviFilters.length < 20 && (
              <button onClick={addRaviFilter} className="add-ravi-btn">
                <FaPlus />
              </button>
            )}
          </div>
          <div className="hadith-id-filter">
            <input
              type="text"
              placeholder="Hadis ID"
              value={hadithId}
              onChange={(e) => setHadithId(e.target.value)}
              className="hadith-id-input"
            />
          </div>
          <button onClick={applyFilters} className="apply-filters-btn">
            <FaFilter className="icon" />
            Filtreleri Uygula
          </button>
        </div>
        <div className="chart-section">
          <div className="chart-nav">
            <button
              className={`chart-nav-btn ${activeChart === 'general' ? 'active' : ''}`}
              onClick={() => setActiveChart('general')}
            >
              Genel Analiz
            </button>
            <button
              className={`chart-nav-btn ${activeChart === 'reliability' ? 'active' : ''}`}
              onClick={() => setActiveChart('reliability')}
            >
              Güvenilirlik Analizi
            </button>
            <button
              className={`chart-nav-btn ${activeChart === 'narrators' ? 'active' : ''}`}
              onClick={() => setActiveChart('narrators')}
            >
              Raviler Analizi
            </button>
          </div>
          {loading ? (
            <div className="loading-spinner">Yükleniyor...</div>
          ) : (
            renderChart()
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
