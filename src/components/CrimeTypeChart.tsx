'use client';

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
}

const CrimeTypeChart: React.FC<ChartProps> = ({ data }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Count by 'text_general_code'
    const typeCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.text_general_code || 'Unknown',
    );

    // Sort and take Top 10
    const top10 = Array.from(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reverse();

    setLabels(top10.map(d => d[0]));
    setValues(top10.map(d => d[1]));
  }, [data]);

  return (
    <Plot
      data={[{ type: 'bar', x: values, y: labels, orientation: 'h', marker: { color: '#ef4444' } }]}
      layout={{
        title: { text: 'Top 10 Incident Types' },
        margin: { l: 150 }, // Space for labels
        width: 500,
        height: 300,
      }}
      config={{ responsive: true }}
    />
  );
};

export default CrimeTypeChart;
