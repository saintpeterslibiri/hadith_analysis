// GraphChartContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const GraphChartContainer = ({ id, title, children }) => (
  <div id={id} className="graph-chart-container">
    <h2>{title}</h2>
    {children}
  </div>
);

GraphChartContainer.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default GraphChartContainer;
