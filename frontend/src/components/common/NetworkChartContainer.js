// MapChartContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const NetworkChartContainer = ({ id, title, children }) => (
  <div id={id} className="network-chart-container">
    <h2>{title}</h2>
    {children}
  </div>
);

NetworkChartContainer.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NetworkChartContainer;