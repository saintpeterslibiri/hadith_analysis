// MapChartContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const MapChartContainer = ({ id, title, children }) => (
  <div id={id} className="map-chart-container">
    <h2>{title}</h2>
    {children}
  </div>
);

MapChartContainer.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default MapChartContainer;