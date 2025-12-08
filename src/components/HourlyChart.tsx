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
      (d) => Number(d.hour)
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
        marker: { color: '#3b82f6' } 
      }]}
      layout={{
        // ✅ FIX 1: Main title must be an object
        title: { text: 'Incidents by Hour' },
        
        xaxis: { 
          // ✅ FIX 2: Axis title must be an object
          title: { text: 'Hour (24h)' }, 
          tickmode: 'linear', 
          dtick: 1 
        },
        yaxis: { 
          // ✅ FIX 3: Axis title must be an object
          title: { text: 'Count' } 
        },
        
        width: 500,
        height: 300,
        margin: { t: 40, b: 40, l: 40, r: 20 },
      }}
      config={{ responsive: true }}
    />
  );
};

export default HourlyChart;