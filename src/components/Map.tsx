/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Plot from 'react-plotly.js';

const ScatterMap: React.FC = () => (
  <Plot
    data={[
      {
        type: 'scattermapbox',
        lat: [39.9526, 39.955, 39.949],
        lon: [-75.1652, -75.17, -75.158],
        mode: 'markers',
        marker: {
          size: 12,
          color: 'red',
        },
        text: ['Point A', 'Point B', 'Point C'],
      },
    ]}
    layout={{
      width: 800,
      height: 600,
      mapbox: {
        style: 'streets',
        center: { lat: 39.9526, lon: -75.1652 },
        zoom: 12,
      },
      margin: { t: 0, b: 0, l: 0, r: 0 },
    }}
  />
);

export default ScatterMap;
