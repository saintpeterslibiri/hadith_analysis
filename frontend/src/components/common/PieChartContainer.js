// PieChartContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const PieChartContainer = ({ id, title, children }) => (
  <div id={id} className="pie-chart-container">
    <h2>{title}</h2>
    {children}
  </div>
);

PieChartContainer.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PieChartContainer;