'use client';

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
}

const HourlyChart: React.FC<ChartProps> = ({ data }) => {
  const [xValues, setXValues] = useState<number[]>([]);
  const [yValues, setYValues] = useState<number[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Group by Hour
    const hourCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => Number(d.hour),
    );

    const sortedData = Array.from(hourCounts).sort((a, b) => a[0] - b[0]);

    setXValues(sortedData.map(d => d[0]));
    setYValues(sortedData.map(d => d[1]));
  }, [data]);

  return (
    <Plot
      data={[{
        type: 'bar',
        x: xValues,
        y: yValues,
        marker: { color: '#3b82f6' },
      }]}
      layout={{
        title: { text: 'Incidents by Hour' },

        // FIX 1: Add automargin so labels push the chart area instead of getting cut
        xaxis: {
          title: { text: 'Hour (24h)' },
          tickmode: 'linear',
          dtick: 1,
          automargin: true,
        },
        yaxis: {
          title: { text: 'Count' },
          automargin: true,
        },

        // FIX 2: Ensure layout is responsive
        autosize: true,
        height: 400, // Matches your other chart

        // FIX 3: Increase top margin (t) so the highest bars don't hit the title
        margin: { t: 50, b: 40, l: 50, r: 20 },
      }}
      // FIX 4: Vital for responsiveness in flex containers
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default HourlyChart;
