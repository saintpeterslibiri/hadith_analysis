import React, { useState } from 'react';
import { fetchRaviToRavi } from '../api/raviApi';

const RaviFilters = ({ tribeList = [], jobList = [], nisbeList = [], hocalarList = [], talebelerList = [], onFilterApply, onClearFilters }) => {
    const [selectedTribes, setSelectedTribes] = useState([]);   
    const [selectedJobs, setSelectedJobs] = useState([]);   
    const [selectedNisbes, setSelectedNisbes] = useState([]);
    const [selectedHocalar, setSelectedHocalar] = useState([]);
    const [selectedTalebeler, setSelectedTalebeler] = useState([]);
    const [tribeSearch, setTribeSearch] = useState('');
    const [jobSearch, setJobSearch] = useState('');
    const [nisbeSearch, setNisbeSearch] = useState('');
    const [hocalarSearch, setHocalarSearch] = useState('');
    const [talebelerSearch, setTalebelerSearch] = useState('');
    const [isTribeOpen, setIsTribeOpen] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [isNisbeOpen, setIsNisbeOpen] = useState(false);
    const [isHocalarOpen, setIsHocalarOpen] = useState(false);
    const [isTalebelerOpen, setIsTalebelerOpen] = useState(false);

    const handleTribeToggle = (tribe) => {
        setSelectedTribes(prev =>
            prev.includes(tribe) ? prev.filter(t => t !== tribe) : [...prev, tribe]
        );
    };  
    const handleJobToggle = (job) => {
        setSelectedJobs(prev =>
            prev.includes(job) ? prev.filter(j => j !== job) : [...prev, job]
        );
    };  
    const handleNisbeToggle = (nisbe) => {
        setSelectedNisbes(prev =>
            prev.includes(nisbe) ? prev.filter(n => n !== nisbe) : [...prev, nisbe]
        );
    };

    const handleHocaToggle = (hoca) => {
        setSelectedHocalar(prev =>
            prev.includes(hoca) ? prev.filter(h => h !== hoca) : [...prev, hoca]
        );
    };

    const handleTalebeToggle = (talebe) => {
        setSelectedTalebeler(prev =>
            prev.includes(talebe) ? prev.filter(t => t !== talebe) : [...prev, talebe]
        );
    };
    const filteredTribes = tribeList.filter(tribe =>
        tribe.toLowerCase().includes(tribeSearch.toLowerCase())
    );
    const filteredJobs = jobList.filter(job =>
        job.toLowerCase().includes(jobSearch.toLowerCase())
    );
    const filteredNisbes = nisbeList.filter(nisbe =>
        nisbe.toLowerCase().includes(nisbeSearch.toLowerCase())
    );

    const filteredHocalar = hocalarList.filter(hoca =>
        hoca.toLowerCase().includes(hocalarSearch.toLowerCase())
    );

    const filteredTalebeler = talebelerList.filter(talebe =>
        talebe.toLowerCase().includes(talebelerSearch.toLowerCase())
    );

    const handleFilter = () => {
        onFilterApply({ tribes: selectedTribes, jobs: selectedJobs, nisbes: selectedNisbes, hocalar: selectedHocalar, talebeler: selectedTalebeler });
    };
    const handleClearFilters = () => {
        setSelectedTribes([]);
        setSelectedJobs([]);
        setSelectedNisbes([]);
        setSelectedHocalar([]);
        setSelectedTalebeler([]);
        onClearFilters(); // Ana bileşene bildir
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsTribeOpen(!isTribeOpen)}
                >
                    <h3 className="text-lg font-semibold">Tribes</h3>
                    <span>{isTribeOpen ? '▲' : '▼'}</span>
                </div>
                {isTribeOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search Tribes..."
                            value={tribeSearch}
                            onChange={(e) => setTribeSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 min-h-40 max-h-40 overflow-y-auto border-x-4 border-b-4 ">
                            {filteredTribes.map((tribe, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedTribes.includes(tribe)}
                                        onChange={() => handleTribeToggle(tribe)}
                                    />
                                    <span>{tribe}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsJobOpen(!isJobOpen)}
                >
                    <h3 className="text-lg font-semibold">Jobs</h3>
                    <span>{isJobOpen ? '▲' : '▼'}</span>
                </div>
                {isJobOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={jobSearch}
                            onChange={(e) => setJobSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 min-h-40 max-h-40 overflow-y-auto border-x-4 border-b-4 ">
                            {filteredJobs.map((job, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedJobs.includes(job)}
                                        onChange={() => handleJobToggle(job)}
                                    />
                                    <span>{job}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsNisbeOpen(!isNisbeOpen)}
                >
                    <h3 className="text-lg font-semibold">Nisbe</h3>
                    <span>{isNisbeOpen ? '▲' : '▼'}</span>
                </div>
                {isNisbeOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search nisbes..."
                            value={nisbeSearch}
                            onChange={(e) => setNisbeSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 min-h-40 max-h-40 overflow-y-auto border-x-4 border-b-4 ">
                            {filteredNisbes.map((nisbe, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedNisbes.includes(nisbe)}
                                        onChange={() => handleNisbeToggle(nisbe)}
                                    />
                                    <span>{nisbe}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsHocalarOpen(!isHocalarOpen)}
                >
                    <h3 className="text-lg font-semibold">Hocalar</h3>
                    <span>{isHocalarOpen ? '▲' : '▼'}</span>
                </div>
                {isHocalarOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search hocalar..."
                            value={hocalarSearch}
                            onChange={(e) => setHocalarSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 min-h-40 max-h-40 overflow-y-auto border-x-4 border-b-4 ">
                            {filteredHocalar.map((hoca, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedHocalar.includes(hoca)}
                                        onChange={() => handleHocaToggle(hoca)}
                                    />
                                    <span>{hoca}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsTalebelerOpen(!isTalebelerOpen)}
                >
                    <h3 className="text-lg font-semibold">Talebeler</h3>
                    <span>{isTalebelerOpen ? '▲' : '▼'}</span>
                </div>
                {isTalebelerOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search talebeler..."
                            value={talebelerSearch}
                            onChange={(e) => setTalebelerSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 min-h-40 max-h-40 overflow-y-auto border-x-4 border-b-4 ">
                            {filteredTalebeler.map((talebe, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedTalebeler.includes(talebe)}
                                        onChange={() => handleTalebeToggle(talebe)}
                                    />
                                    <span>{talebe}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={handleFilter}
                className='w-full hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white'
            >
                Filter
            </button>
            <button
                    onClick={handleClearFilters}
                    className='w-full hover:underline px-4 py-2 text-sm bg-red-500 rounded-full text-white my-2'
                >
                    Clear Filters
                </button>
        </div>
    );
};

export default RaviFilters;