import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HadithByRaviReliabilityChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Number of Hadiths',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hiddenIndices, setHiddenIndices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5031/api/Ravis/hadith-by-ravi-reliability');
        const data = response.data;

        setChartData({
          labels: data.map(item => item.reliability),
          datasets: [{
            label: 'Number of Hadiths',
            data: data.map(item => item.hadithCount),
            backgroundColor: data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
            borderColor: data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching hadith by ravi reliability data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleVisibility = (index) => {
    setHiddenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.map((value, index) => (hiddenIndices.includes(index) ? 0 : value)),
      backgroundColor: dataset.backgroundColor.map((color, index) => (hiddenIndices.includes(index) ? 'rgba(0, 0, 0, 0.1)' : color)),
      borderColor: dataset.borderColor.map((color, index) => (hiddenIndices.includes(index) ? 'rgba(0, 0, 0, 0.1)' : color)),
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="hadith-by-reliability-container">
      <div className="reliability-list">
        <h3>Reliability</h3>
        <ul>
          {chartData.labels.map((reliability, index) => (
            <li key={index}>
              <button
                onClick={() => handleToggleVisibility(index)}
                style={{
                  color: hiddenIndices.includes(index) ? 'black' : chartData.datasets[0].backgroundColor[index],
                  textDecoration: hiddenIndices.includes(index) ? 'line-through' : 'none'
                }}
              >
                {reliability}: {chartData.datasets[0].data[index]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="chart-container">
        <Pie data={filteredChartData} options={options} />
      </div>
    </div>
  );
};

export default HadithByRaviReliabilityChart;
