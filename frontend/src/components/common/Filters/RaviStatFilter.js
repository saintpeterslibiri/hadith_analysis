import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const RaviStatFilter = ({ filter, index, onChange, onRemove }) => {
  const [filterType, setFilterType] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      let endpoint = '';
      if (filterType === 'reliability') {
        endpoint = 'http://localhost:5031/api/Ravis/reliability-list';
      } else if (filterType === 'job') {
        endpoint = 'http://localhost:5031/api/Ravis/job-list';
      } else if (filterType === 'tribe') {
        endpoint = 'http://localhost:5031/api/Ravis/tribe-list';
      }

      if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          setOptions(response.data.map(item => ({
            value: item,
            label: item
          })));
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      }
    };

    if (filterType) {
      fetchOptions();
    }
  }, [filterType]);

  const handleFilterTypeChange = (e) => {
    const newFilterType = e.target.value;
    setFilterType(newFilterType);
    onChange(index, 'type', newFilterType);
    onChange(index, 'value', ''); // Clear the value when the filter type changes
  };

  return (
    <div className="ravi-filter">
      <select
        value={filter.rank}
        onChange={(e) => onChange(index, 'rank', e.target.value)}
        className="ravi-input"
      >
        <option value="">Halka</option>
        {[...Array(20)].map((_, i) => (
          <option key={i} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        value={filterType}
        onChange={handleFilterTypeChange}
        className="ravi-input"
      >
        <option value="">Durum Seç...</option>
        <option value="reliability">Güvenilirlik</option>
        <option value="job">Meslek</option>
        <option value="tribe">Kabile</option>
      </select>
      <select
        value={filter.value || ''}
        onChange={(e) => onChange(index, 'value', e.target.value)}
        className="ravi-input"
        disabled={!filterType}
      >
        <option value="">Seçenek Seç...</option>
        {options.length > 0 ? (
          options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option value="">No options available</option>
        )}
      </select>
      <button onClick={() => onRemove(index)} className="ravi-remove-btn">
        -
      </button>
    </div>
  );
};

export default RaviStatFilter;
