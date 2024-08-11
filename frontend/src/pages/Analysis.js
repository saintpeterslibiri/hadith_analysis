import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../analysis.css';
import { FaPlus, FaFilter, FaKeyboard, FaSearch } from 'react-icons/fa';
import RaviNameFilter from '../components/common/Filters/RaviNameFilter';
import RaviStatFilter from '../components/common/Filters/RaviStatFilter';
import ChainModal from './ChainModal';
import ArabicKeyboard from '../components/common/arabicLayout';
import keyboard from '../components/common/keyboard.png'

const Analysis = () => {
  const [hadiths, setHadiths] = useState([]);
  const [totalHadiths, setTotalHadiths] = useState(null);
  const [raviNameFilters, setRaviNameFilters] = useState([{ rank: '', name: '' }]);
  const [raviStatFilters, setRaviStatFilters] = useState([{ type: '', value: '' }]);
  const [selectedChain, setSelectedChain] = useState(null);
  const [hadithId, setHadithId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gotoPage, setGotoPage] = useState('');


  useEffect(() => {
    fetchHadiths();
    fetchTotalHadiths();
  }, [currentPage]);

  const fetchHadiths = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5031/api/hadiths`, {
        params: {
          page: currentPage,
          search: searchTerm,
          filters: { raviNameFilters, raviStatFilters, hadithId }
        },
      });
      setHadiths(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      setIsLoading(false);
    }
  };

  const fetchTotalHadiths = async () => {
    try {
      const response = await axios.get('http://localhost:5031/api/hadiths/count', {
        params: {
          search: searchTerm,
          filters: { raviNameFilters, raviStatFilters }
        },
      });
      setTotalHadiths(response.data);
      setTotalPages(Math.ceil(response.data / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error('Error fetching total hadiths count:', error);
      setTotalHadiths(0);
      setTotalPages(0);
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
      setRaviStatFilters([...raviStatFilters, { type: '', value: '' }]);
    }
  };

  const removeRaviNameFilter = (index) => {
    setRaviNameFilters(raviNameFilters.filter((_, i) => i !== index));
  };

  const removeRaviStatFilter = (index) => {
    setRaviStatFilters(raviStatFilters.filter((_, i) => i !== index));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleKeyPress = (key) => {
    if (key === 'delete') {
      setSearchTerm(prevTerm => prevTerm.slice(0, -1));
    } else {
      setSearchTerm(prevTerm => prevTerm + key);
    }
    setCurrentPage(1);
  };

  const toggleArabicKeyboard = () => {
    setShowArabicKeyboard(!showArabicKeyboard);
  };

  const handleChainClick = (chain) => {
    const cleanChain = chain.replace(/[^\d;]/g, '');
    const formattedChain = cleanChain.replace(/;/g, ',');
    setSelectedChain(formattedChain);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchHadiths();
    fetchTotalHadiths();
  };
  
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
};
const renderPagination = () => {
  if (totalPages === 0) return null;
  const pages = [];

  // Always show first page
  pages.push(
    <button
      key={1}
      onClick={() => handlePageClick(1)}
      className={`mx-1 px-3 py-2 rounded border ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
    >
      1
    </button>
  );

  // Calculate range of pages to show
  let startPage = Math.max(2, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);

  // Add ellipsis if there's a gap after page 1
  if (startPage > 2) {
    pages.push(<span key="start-ellipsis">...</span>);
  }

  // Add pages in the middle
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageClick(i)}
        className={`mx-1 px-3 py-2 rounded border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
      >
        {i}
      </button>
    );
  }

  // Add ellipsis if there's a gap before the last page
  if (endPage < totalPages - 1) {
    pages.push(<span key="end-ellipsis">...</span>);
  }

  // Always show last page if it's not already included
  if (totalPages > 1 && endPage !== totalPages) {
    pages.push(
      <button
        key={totalPages}
        onClick={() => handlePageClick(totalPages)}
        className={`mx-1 px-3 py-2 rounded border ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className="mt-5 text-center">
      {pages}
      <div className="mt-3">
        <label htmlFor="goto-page" className="mr-2">
          Go to page:
        </label>
        <input
          id="goto-page"
          type="number"
          min="1"
          max={totalPages}
          value={gotoPage}
          onChange={(e) => setGotoPage(e.target.value)}
          className="mx-2 px-3 py-2 rounded border"
        />
        <button
          onClick={() => handlePageClick(Number(gotoPage))}
          className="px-3 py-2 rounded border bg-blue-500 text-white"
        >
          Go
        </button>
      </div>
    </div>
  );
};


  return (
    <div className="analysis">
      <div className="filters">
        <h2>Filtreler</h2>
        <div className="filter-group">
          <p className="text-xl font-bold text-gray-800 mb-2">
            Total Hadiths Found: {isLoading ? 'Loading...' : totalHadiths}
          </p>
          <p className="text-md text-gray-700">
            <span className="font-semibold">Current Filters:</span>
            {searchTerm && <span className="ml-2 px-2 py-1 bg-purple-100 rounded-full text-sm">{`Search: "${searchTerm}"`}</span>}
          </p>
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
              <FaPlus />
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
          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
        </div>
        <input
          type="text"
          placeholder="Hadis ID"
          value={hadithId}
          onChange={(e) => setHadithId(e.target.value)}
          className="hadith-id-input"
        />
      </div>

      <div className="charts">
        <div className="mb-5 text-center relative">
          <div className="flex items-center justify-center">
            <button
              onClick={toggleArabicKeyboard}
              className="p-2 text-lg border-gray-300"
            >
            <img src={keyboard} alt="Keyboard Icon" className="ml-2" width="24" height="24" />

            </button>
            <input
              type="text"
              placeholder="Search hadiths..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full md:w-6/12 p-2 text-lg rounded-full border border-gray-300 mx-2"
            />
            <button
              onClick={applyFilters}
              className="p-2 text-lg border-gray-300"
            >
              <FaSearch />
            </button>
          </div>
          {showArabicKeyboard && (
              <div className="absolute z-10 mt-2 right-100 transform translate-x-1/7 translate-y-3/5">
                  <ArabicKeyboard onKeyPress={handleKeyPress} />
              </div>
          )}

        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-5">
            {hadiths.map((hadith) => (
              <li
                key={hadith.id}
                className="p-4 border rounded-lg shadow-lg bg-white/80 backdrop-blur-lg shadow-blue-300 transform transition-transform duration-300 hover:shadow-blue-100"
              >
                <div className="flex flex-col space-y-2">
                  <p className="text-center text-gray-700"><strong>Hadith ID:</strong> {hadith.id}</p>
                  {hadith.arabic && <p className="text-center text-gray-700"><strong>Arabic:</strong> {hadith.arabic}</p>}
                  {hadith.turkish && <p className="text-center text-gray-700"><strong>Turkish:</strong> {hadith.turkish}</p>}
                  {hadith.musannif && <p className="text-center text-gray-700"><strong>Musannif:</strong> {hadith.musannif}</p>}
                  {hadith.book && <p className="text-center text-gray-700"><strong>Book:</strong> {hadith.book}</p>}
                  {hadith.topic && <p className="text-center text-gray-700"><strong>Topic:</strong> {hadith.topic}</p>}
                  {hadith.chain && (
                    <>
                      <p className="text-center text-gray-700"><strong>Chain:</strong> {hadith.chain}</p>
                      <button
                        onClick={() => handleChainClick(hadith.chain)}
                        className="mt-2 px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-300"
                      >
                        View Senet
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      <div className="flex justify-center mt-5 space-x-3">
          <button
              onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
              className="px-4 py-2 text-sm bg-dark-blue rounded-full text-white"
          >
              Previous
          </button>
          {renderPagination()}
          <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 text-sm bg-dark-blue rounded-full text-white"
          >
              Next
          </button>
      </div>
      </div>
      {selectedChain && (
        <ChainModal chain={selectedChain} onClose={() => setSelectedChain(null)} />
      )}
    </div>
  );
};

export default Analysis;
