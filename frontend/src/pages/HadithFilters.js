import React, { useState, useEffect } from 'react';
import RaviStatFilter from '../components/common/Filters/RaviStatFilter';
import RaviNameFilter from '../components/common/Filters/RaviNameFilter';

const Filters = ({ bookList, musannifList, RaviNameFilter, RaviStatusFilter, onFilterApply, onClearFilters  }) => {
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [selectedMusannifs, setSelectedMusannifs] = useState([]);
    const [bookSearch, setBookSearch] = useState('');
    const [musannifSearch, setMusannifSearch] = useState('');
    const [isBooksOpen, setIsBooksOpen] = useState(false);
    const [isRaviNameOpen, setIsRaviNameOpen] = useState(false);
    const [isRaviStatusOpen, setIsRaviStatusOpen] = useState(false);    
    const [isMusannifsOpen, setIsMusannifsOpen] = useState(false);
    const [chainLength, setChainLength] = useState();
    const [raviNameFilters, setRaviNameFilters] = useState([{ name: '', rank: -1 }]);
    const [raviStatusFilters, setRaviStatusFilters] = useState([{ type: '', value: '', rank: -1 }]);

    const handleBookToggle = (book) => {
        setSelectedBooks(prev =>
            prev.includes(book) ? prev.filter(b => b !== book) : [...prev, book]
        );
    };

    const handleMusannifToggle = (musannif) => {
        setSelectedMusannifs(prev =>
            prev.includes(musannif) ? prev.filter(m => m !== musannif) : [...prev, musannif]
        );
    };

    const filteredBooks = bookList.filter(book =>
        book.toLowerCase().includes(bookSearch.toLowerCase())
    );

    const filteredMusannifs = musannifList.filter(musannif =>
        musannif.toLowerCase().includes(musannifSearch.toLowerCase())
    );

    const handleFilter = () => {
        onFilterApply({ books: selectedBooks, musannifs: selectedMusannifs, chainLength, raviNameFilters, raviStatusFilters });
    };

    const handleChainLengthChange = (event) => {
        setChainLength(parseInt(event.target.value));
    };

    const handleClearFilters = () => {
        setSelectedBooks([]);
        setSelectedMusannifs([]);
        setChainLength(0);
        onClearFilters(); // Ana bileşene bildir
    };

    const handleRaviNameFilterChange = (index, key, value) => {
        const newFilters = [...raviNameFilters];
        newFilters[index][key] = value;
        setRaviNameFilters(newFilters);
    };

    const handleRaviNameFilterRemove = (index) => {
        const newFilters = [...raviNameFilters];
        newFilters.splice(index, 1);
        setRaviNameFilters(newFilters);
    };

    const handleRaviStatusFilterChange = (index, key, value) => {
        const newFilters = [...raviStatusFilters];
        newFilters[index][key] = value;
        setRaviStatusFilters(newFilters);
    };

    const handleRaviStatusFilterRemove = (index) => {
        const newFilters = [...raviStatusFilters];
        newFilters.splice(index, 1);
        setRaviStatusFilters(newFilters);
    };

    useEffect(() => {
        const slider = document.getElementById('numberSlider');
        const updateSliderPosition = () => {
            const percent = ((chainLength - 0) / (19 - 0)) * 100;
            slider.style.background = `linear-gradient(to right, #5a67d8 0%, #5a67d8 ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`;
        };
        updateSliderPosition();
    }, [chainLength]);

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>

            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsBooksOpen(!isBooksOpen)}
                >
                    <h3 className="text-lg font-semibold">Books</h3>
                    <span>{isBooksOpen ? '▲' : '▼'}</span>
                </div>
                {isBooksOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={bookSearch}
                            onChange={(e) => setBookSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 max-h-40 overflow-y-auto">
                            {filteredBooks.map((book, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedBooks.includes(book)}
                                        onChange={() => handleBookToggle(book)}
                                    />
                                    <span>{book}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsMusannifsOpen(!isMusannifsOpen)}
                >
                    <h3 className="text-lg font-semibold">Musannif</h3>
                    <span>{isMusannifsOpen ? '▲' : '▼'}</span>
                </div>
                {isMusannifsOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search musannifs..."
                            value={musannifSearch}
                            onChange={(e) => setMusannifSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 max-h-40 overflow-y-auto">
                            {filteredMusannifs.map((musannif, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedMusannifs.includes(musannif)}
                                        onChange={() => handleMusannifToggle(musannif)}
                                    />
                                    <span>{musannif}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mb-6">
                <div 
                    className="mb-3 flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsRaviNameOpen(!isRaviNameOpen)}
                >
                    <h3 className="text-lg font-semibold">Ravi Name</h3>
                    <span>{isRaviNameOpen ? '▲' : '▼'}</span>
                </div>
                {isRaviNameOpen && (
                    <>
                        <div>
                            {raviNameFilters.map((filter, index) => (
                                <RaviNameFilter
                                    key={index}
                                    filter={filter}
                                    index={index}
                                    onChange={handleRaviNameFilterChange}
                                    onRemove={handleRaviNameFilterRemove}
                                />
                            ))}
                            <button
                                onClick={() => setRaviNameFilters([...raviNameFilters, { name: '', rank: -1 }])}
                                className="w-full hover:underline px-4 py-2 text-sm bg-blue-500 rounded-full text-white"
                            >
                                Add Ravi Name Filter
                            </button>
                        </div>
                    </>
                )}
            </div>    
            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsRaviNameOpen(!isRaviStatusOpen)}
                >
                    <h3 className="text-lg font-semibold">Ravi Status</h3>
                    <span>{isRaviStatusOpen ? '▲' : '▼'}</span>
                </div>
                {isBooksOpen && (
                    <>
                        
                    </>
                )}
            </div>    
            <div className="number-selector mb-6">
                <h3 className="text-lg font-semibold mb-2">Select Chain Length</h3>
                <div className="slider-container">
                    <input 
                        type="range" 
                        min="0" 
                        max="19" 
                        value={chainLength} 
                        step="1" 
                        className="slider" 
                        id="numberSlider"
                        onChange={handleChainLengthChange}
                    />
                    <output htmlFor="numberSlider" className="slider-value" style={{left: `calc(${(chainLength / 19) * 100}% - 10px)`}}>
                        {chainLength >= 0 ? chainLength : 'Any'}
                    </output>
                </div>
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

export default Filters;
