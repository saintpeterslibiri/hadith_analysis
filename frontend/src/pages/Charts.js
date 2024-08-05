import React, { useState } from 'react';
import HadithByTribeChart from '../components/charts/HadithByTribeChart';
import HadithByBookChart from '../components/charts/HadithByBookChart';
import HadithByMusannifChart from '../components/charts/HadithByMusannifChart';
import HadithByRaviReliabilityChart from '../components/charts/HadithByRaviReliabilityChart';
import HadithByRaviNisbesiChart from '../components/charts/HadithByRaviNisbesiChart';
import HadithByPlacesMap from '../components/charts/HadithByPlacesMap';
import HadithByTime from '../components/charts/HadithByTime';
import GraphChartContainer from '../components/common/GraphChartContainer';
import NetworkChartContainer from '../components/common/NetworkChartContainer';
import PieChartContainer from '../components/common/PieChartContainer';
import MapChartContainer from '../components/common/MapChartContainer';
import HadithNetworkGraph from '../components/charts/HadithsNetworkGraph';

const Charts = () => {
  const [selectedChart, setSelectedChart] = useState(null);

  const chartOptions = [
    { id: 'tribe', label: 'By Tribe' },
    { id: 'book', label: 'By Book' },
    { id: 'musannif', label: 'By Musannif' },
    { id: 'reliability', label: 'By Reliability' },
    { id: 'places', label: 'By Places' },
    { id: 'time', label: 'By Time' },
    { id: 'network', label: 'Network' },
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'tribe':
        return (
          <PieChartContainer title="Hadiths Grouped By With Its Chain's First Ravi's Tribe">
            <HadithByTribeChart />
          </PieChartContainer>
        );
      case 'book':
        return (
          <GraphChartContainer title="Hadiths Grouped By Book Which It is Written">
            <HadithByBookChart />
          </GraphChartContainer>
        );
      case 'musannif':
        return (
          <GraphChartContainer title="Hadiths Grouped By Musannif">
            <HadithByMusannifChart />
          </GraphChartContainer>
        );
      case 'reliability':
        return (
          <PieChartContainer title="Hadiths Grouped By Its Chain's First Ravi's Reliability">
            <HadithByRaviReliabilityChart />
          </PieChartContainer>
        );
      case 'places':
        return (
          <MapChartContainer>
            <HadithByPlacesMap />
          </MapChartContainer>
        );
      case 'time':
        return (
          <GraphChartContainer title="Hadiths Grouped by Its Chain's First Ravi's Death Year">
            <HadithByTime />
          </GraphChartContainer>
        );
      case 'network':
        return (
          <NetworkChartContainer>
            <HadithNetworkGraph />
          </NetworkChartContainer>
        );
      default:
        return <div className="text-center mt-8 text-lg text-gray-700">Please select a chart to display.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
      <nav className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${
                selectedChart === option.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
              onClick={() => setSelectedChart(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="container mx-auto">
        {renderChart()}
      </div>
    </div>
  );
};

export default Charts;
