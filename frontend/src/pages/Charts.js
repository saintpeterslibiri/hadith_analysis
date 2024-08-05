import React, { useState } from 'react';
import HadithByTribeChart from '../components/charts/HadithByTribeChart';
import HadithByBookChart from '../components/charts/HadithByBookChart';
import HadithByMusannifChart from '../components/charts/HadithByMusannifChart';
import HadithByRaviReliabilityChart from '../components/charts/HadithByRaviReliabilityChart';
import HadithByRaviNisbesiChart from '../components/charts/HadithByRaviNisbesiChart';
import HadithByPlacesMap from '../components/charts/HadithByPlacesMap';
import HadithByTime from '../components/charts/HadithByTime';
import GraphChartContainer from '../components/common/GraphChartContainer';
import NetworkChartContainer from '../components/common/NetworkChartContainer'
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
          <PieChartContainer title="Hadiths Grouped By With Its Chain's First Ravi's Tribe ">
            <HadithByTribeChart />
          </PieChartContainer>
        );
      case 'book':
        return (
          <GraphChartContainer title="Hadiths Grouped By Book Which It is written">
            <HadithByBookChart />
          </GraphChartContainer>
        );
      case 'musannif':
        return (
          <GraphChartContainer id="musannif-chart" title="Hadiths Grouped By Musannif">
          <HadithByMusannifChart />
        </GraphChartContainer>
        );
        case 'reliability':
          return (
            <PieChartContainer 
              id="reliability"
              title="Hadiths Grouped By Its Chain's First Ravi's Reliability">
              <HadithByRaviReliabilityChart />
            </PieChartContainer>
          );
          case 'places':
          return (
            
            <MapChartContainer 
            
              id="places"
              >
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
            <NetworkChartContainer  >
              <HadithNetworkGraph/>
            </NetworkChartContainer >
          );
      default:
        return <div>Please select a chart to display.</div>;
    }
  };
  return (
    <div className="dashboard">
      <nav className="chart-nav">
        <div className="chart-nav-container">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              className={`chart-nav-button ${selectedChart === option.id ? 'active' : ''}`}
              onClick={() => setSelectedChart(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default Charts;
