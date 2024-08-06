import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import debounce from 'lodash.debounce';

const RaviNameFilter = ({ filter, index, onChange, onRemove }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionRefs = useRef([]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5031/api/Ravis/narrator-name-list?query=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    if (filter.name.length > 1) {
      debouncedFetchSuggestions(filter.name);
    } else {
      setSuggestions([]);
    }
  }, [filter.name]);

  const handleSuggestionClick = (name) => {
    onChange(index, 'name', name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    if (filter.name.length > 1) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, suggestions.length - 1);
        suggestionRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        suggestionRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      }
    }
  };

  return (
    <div className="ravi-filter">
      <select
        value={filter.rank}
        onChange={(e) => onChange(index, 'rank', e.target.value)}
        className="ravi-select"
      >
        <option value="">Halka</option>
        {[...Array(20)].map((_, i) => (
          <option key={i} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <div className="ravi-input-container">
        <input
          type="text"
          placeholder="Ravi ismi"
          value={filter.name}
          onChange={(e) => {
            onChange(index, 'name', e.target.value);
            setShowSuggestions(true);
            setActiveSuggestionIndex(-1);
          }}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="ravi-input ravi-name-input"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="ravi-suggestions">
            {suggestions.map((narrator, i) => (
              <li
                key={i}
                ref={(el) => (suggestionRefs.current[i] = el)}
                onClick={() => handleSuggestionClick(narrator)}
                className={activeSuggestionIndex === i ? 'active' : ''}
              >
                {narrator}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => onRemove(index)} className="ravi-remove-btn">
          -
      </button>
    </div>
  );
};

export default RaviNameFilter;
