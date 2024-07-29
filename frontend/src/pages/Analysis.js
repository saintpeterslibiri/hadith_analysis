import React, { useState } from 'react';
import HadithByTribeChart from '../components/charts/HadithByTribeChart';
import HadithByBookChart from '../components/charts/HadithByBookChart';
import HadithByMusannifChart from '../components/charts/HadithByMusannifChart';
import HadithByRaviReliabilityChart from '../components/charts/HadithByRaviReliabilityChart';
import HadithByRaviNisbesiChart from '../components/charts/HadithByRaviNisbesiChart';
import HadithByPlacesMap from '../components/charts/HadithByPlacesMap';
import HadithByTime from '../components/charts/HadithByTime';
import GraphChartContainer from '../components/common/GraphChartContainer';
import PieChartContainer from '../components/common/PieChartContainer';
import MapChartContainer from '../components/common/MapChartContainer';
const Dashboard = () => {
  const [selectedChart, setSelectedChart] = useState(null);

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
          <GraphChartContainer title="Hadiths Grouped By Musannif">
            <HadithByMusannifChart />
          </GraphChartContainer>
        );
        case 'reliability':
          return (
            <PieChartContainer 
              id="reliability-chart"
              title="Hadiths Grouped By Its Chain's First Ravi's Reliability">
              <HadithByRaviReliabilityChart />
            </PieChartContainer>
          );
          case 'places':
          return (
            <MapChartContainer 
              id="places-chart"
              title="Places marked by Hadiths First Chain's Ravi's Death Places">
              <HadithByPlacesMap />
            </MapChartContainer>
          );
      case 'time':
        return (
          <GraphChartContainer title="Hadiths Grouped by Its Chain's First Ravi's Death Year">
            <HadithByTime />
          </GraphChartContainer>
        );
      default:
        return <div>Please select a chart to display.</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="button-row">
        <button className=' hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white button-margin' onClick={() => setSelectedChart('tribe')}>Hadiths by Tribe</button>
        <button className='hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white button-margin' onClick={() => setSelectedChart('book')}>Hadiths by Book</button>
        <button className='hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white button-margin' onClick={() => setSelectedChart('musannif')}>Hadiths by Musannif</button>
        <button className='hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white button-margin' onClick={() => setSelectedChart('reliability')}>Hadiths by Reliability</button>
        <button className='hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white button-margin' onClick={() => setSelectedChart('places')}>Hadiths by Places</button>
        <button className='hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white button-margin' onClick={() => setSelectedChart('time')}>Hadiths by Time</button>
      </div>
      <div className="chart-row">
        {renderChart()}
      </div>
    </div>
  );
};

export default Dashboard;
