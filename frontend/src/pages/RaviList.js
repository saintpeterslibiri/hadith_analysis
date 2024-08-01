import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RaviFilters from './raviFilters';

const RaviList = () => {
    const [ravis, setRavis] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRavis, setTotalRavis] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tribeList, setTribeList] = useState([]);
    const [jobList, setJobList] = useState([]);
    const [nisbeList, setNisbeList] = useState([]);
    const [hocalarList, setHocalarList] = useState([]);
    const [talebelerList, setTalebelerList] = useState([]);
    const [selectedTribes, setSelectedTribes] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectedNisbes, setSelectedNisbes] = useState([]);
    const [selectedHocalar, setSelectedHocalar] = useState([]);
    const [selectedTalebeler, setSelectedTalebeler] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fileFormat, setFileFormat] = useState('');
    const [allRavis, setAllRavis] = useState('');
    const [isFormatLoading, setIsFormatLoading] = useState(false);

    useEffect(() => {
        fetchData();
        fetchTribeList();
        fetchJobList();
        fetchNisbeList();
        fetchHocalarList();
        fetchTalebelerList();
        fetchTotalRavis();
    }, [currentPage, searchTerm, selectedTribes ,selectedJobs, selectedNisbes, selectedHocalar, selectedTalebeler]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5031/api/Ravis`, {
                params: {
                    page: currentPage,
                    search: searchTerm,
                    tribe: selectedTribes,
                    job: selectedJobs,
                    nisbe: selectedNisbes,
                    hocalari: selectedHocalar,
                    talebeleri: selectedTalebeler,
                },
                paramsSerializer: params => {
                    return Object.keys(params)
                        .map(key => Array.isArray(params[key])
                            ? params[key].map(val => `${key}=${val}`).join('&')
                            : `${key}=${params[key]}`)
                        .join('&');
                },
            });
            setRavis(response.data);
            setTotalPages(parseInt(response.headers['total-pages'] || '0', 10));
        } catch (error) {   
            console.error('Error fetching ravis:', error);
        }
    };
    useEffect(() => {
        fetchAllData();
    }, [allRavis]);

    const fetchAllData = async () => {
        try {
            const response = await axios.get(`http://localhost:5031/api/hadiths/all-ravis`, {
                params: {
                    page: currentPage,
                    search: searchTerm,
                    tribe: selectedTribes,
                    job: selectedJobs,
                    nisbe: selectedNisbes,
                    hocalari: selectedHocalar,
                    talebeleri: selectedTalebeler,
                },
                paramsSerializer: params => {
                    return Object.keys(params)
                        .filter(key => params[key] !== undefined)
                        .map(key => Array.isArray(params[key])
                            ? params[key].map(val => `${key}=${val}`).join('&')
                            : `${key}=${params[key]}`)
                        .join('&');
                },
            });
            setAllRavis(response.data);
            console.log(totalPages)
        } catch (error) {   
            console.error('Error fetching hadiths:', error);
        }
    };
    const fetchTotalRavis = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5031/api/ravis/count', {
                params: {
                    search: searchTerm,
                    tribe: selectedTribes,
                    job: selectedJobs,
                    nisbe: selectedNisbes,
                    hocalari: selectedHocalar,
                    talebeleri: selectedTalebeler,
                },
                paramsSerializer: params => {
                    return Object.keys(params)
                        .map(key => Array.isArray(params[key])
                            ? params[key].map(val => `${key}=${val}`).join('&')
                            : `${key}=${params[key]}`)
                        .join('&');
                },
            });
            setTotalRavis(response.data);
        } catch (error) {
            console.error('Error fetching total ravis count:', error);
            setTotalRavis(0);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchTribeList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/Ravis/tribe-list');
            setTribeList(response.data);
        } catch (error) {
            console.error('Error fetching job list:', error);
        }
    };
    const fetchJobList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/Ravis/job-list');
            setJobList(response.data);
        } catch (error) {
            console.error('Error fetching job list:', error);
        }
    };

    const fetchNisbeList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/Ravis/nisbe-list');
            setNisbeList(response.data);
        } catch (error) {
            console.error('Error fetching nisbe list:', error);
        }
    };

    const fetchHocalarList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/Ravis/hocalari-list');
            setHocalarList(response.data);
        } catch (error) {
            console.error('Error fetching hocalar list:', error);
        }
    };

    const fetchTalebelerList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/Ravis/talebeleri-list');
            setTalebelerList(response.data);
        } catch (error) {
            console.error('Error fetching talebeler list:', error);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    
    const handleFilterApply = ({ tribes, jobs, nisbes, hocalar, talebeler }) => {
        setSelectedTribes(tribes);
        setSelectedJobs(jobs);
        setSelectedNisbes(nisbes);
        setSelectedHocalar(hocalar);
        setSelectedTalebeler(talebeler);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSelectedTribes([]);
        setSelectedJobs([]);
        setSelectedNisbes([]);
        setSelectedNisbes([]);
        setSelectedHocalar([])
        setSelectedTalebeler([])
        setSearchTerm('');
        setCurrentPage(1);
        fetchData();
        fetchTotalRavis();
    };
    const handleDownloadButton = async (format) => {
        setIsFormatLoading(true);
        try {
          const queryParams = new URLSearchParams({
            format: format,
            search: searchTerm,
            ...(selectedJobs.length > 0 && {job: selectedJobs}),
            ...(selectedNisbes.length > 0 && {nisbe: selectedNisbes}),
            ...(selectedTribes.length > 0 && {tribe: selectedTribes}),
            ...(selectedHocalar.length > 0 && {hocalar: selectedHocalar}),
            ...(selectedTalebeler.length > 0 && {talebeler: selectedTalebeler}),
          });
      
          const response = await axios.get(`http://localhost:5031/api/ravis/download?${queryParams}`, {
            responseType: 'blob'
          });
      
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'ravis.zip');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } catch (error) {
          console.error('Download failed:', error);
          alert('İndirme başarısız oldu. Lütfen daha sonra tekrar deneyin.');
        } finally {
          setIsFormatLoading(false);
        }
      };

    const renderPagination = () => {
        if (totalPages === 0) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`mx-1 px-4 py-2 border rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return (
            <div className="mt-5 flex justify-center">
                {pages}
            </div>
        );
    };

    return (
        <div className="flex justify-center">
            <div className="w-1/4 mt-5 mr-5">
                <RaviFilters
                    tribeList={tribeList}               
                    jobList={jobList}
                    nisbeList={nisbeList}
                    hocalarList={hocalarList}
                    talebelerList={talebelerList}
                    onFilterApply={handleFilterApply}
                    onClearFilters={handleClearFilters}

                />
            </div>
            <div className="w-3/4 mt-5">
            <h1 className="text-center text-4xl font-extrabold p-10 text-gray-700">Ravi List</h1>
                
                <div className="mb-5 p-4 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg" key={totalRavis}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xl font-bold text-gray-800 mb-2">
                            Total Ravis Found: {isLoading ? 'Loading...' : totalRavis}
                        </p>
                        <p className="text-md text-gray-700">
                        <span className="font-semibold">Current Filters:</span>
                        {selectedJobs.length > 0 && <span className="ml-2 px-2 py-1 bg-red-100 rounded-full text-sm">{`Jobs: ${selectedJobs.join(', ')}`}</span>}
                        {selectedNisbes.length > 0 && <span className="ml-2 px-2 py-1 bg-blue-100 rounded-full text-sm">{`Nisbes: ${selectedNisbes.join(', ')}`}</span>}
                        {selectedHocalar.length > 0 && <span className="ml-2 px-2 py-1 bg-green-100 rounded-full text-sm">{`Hocalar: ${selectedHocalar.join(', ')}`}</span>}
                        {selectedTalebeler.length > 0 && <span className="ml-2 px-2 py-1 bg-yellow-100 rounded-full text-sm">{`Talebeler: ${selectedTalebeler.join(', ')}`}</span>}
                        {searchTerm && <span className="ml-2 px-2 py-1 bg-purple-100 rounded-full text-sm">{`Search: "${searchTerm}"`}</span>}
                        {selectedJobs.length === 0 && selectedNisbes.length === 0 && selectedHocalar.length === 0 && selectedTalebeler.length === 0 && !searchTerm && <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-sm">None</span>}
                    </p>
                    </div>
                    <div className="flex items-center">
                        <div className="relative inline-block mr-2">
                            <select
                            id="file-format"
                            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => setFileFormat(e.target.value)}
                            value={fileFormat}
                            >
                            <option value="" disabled>Seç...</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                    <button
                        className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:shadow-outline relative ${isFormatLoading ? 'loading' : ''}`}
                        onClick={() => handleDownloadButton(fileFormat)}
                        disabled={!fileFormat || isFormatLoading}
                    >
                        İndir
                        {isFormatLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="loading-indicator"></div>
                        </div>
                        )}
                    </button>
                    </div>
                </div>
            </div>
                <ul className="space-y-5">
                    {ravis.map((ravi) => (
                        <li key={ravi.ravi_id} className="p-4 border rounded-lg shadow-lg bg-white/80 backdrop-blur-lg shadow-blue-300 transform transition-transform duration-300  hover:shadow-blue-100">
                            <p className="text-center text-gray-700"><strong>Ravi ID:</strong> {ravi.ravi_id}</p>
                            <p className="text-center text-gray-700"><strong>Narrator Name:</strong> {ravi.narrator_name || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Tribe:</strong> {ravi.tribe || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Nisbesi:</strong> {ravi.nisbesi || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Degree:</strong> {ravi.degree || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Reliability:</strong> {ravi.reliability || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Birth Year (Hijri):</strong> {ravi.birth_year_h || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Birth Year (Miladi):</strong> {ravi.birth_year_m || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Death Year (Hijri):</strong> {ravi.death_year_h || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Death Year (Miladi):</strong> {ravi.death_year_m || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Places Lived:</strong> {ravi.placed_lived || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Job:</strong> {ravi.job || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Hocalari:</strong> {ravi.hocalari || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Talebeleri:</strong> {ravi.talebeleri || '-'}</p>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-center mt-5 space-x-3">
                    <button
                        onClick={() => setCurrentPage((prev) => prev > 1 ? prev - 1 : prev)}
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
        </div>
    );
};

export default RaviList;