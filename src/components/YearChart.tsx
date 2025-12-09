'use client';

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
}

const YearChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { x: [], y: [] };

    // Group by Year (first 4 chars of dispatch_date)
    const yearCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.dispatch_date?.split('-')[0],
    );

    // Sort by Year
    const sortedData = Array.from(yearCounts)
      .filter(([year]) => year && !Number.isNaN(Number(year)))
      .sort((a, b) => Number(a[0]) - Number(b[0]));

    return {
      x: sortedData.map((d) => d[0]),
      y: sortedData.map((d) => d[1]),
    };
  }, [data]);

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: chartData.x,
          y: chartData.y,
          marker: { color: '#8884d8' },
        },
      ]}
      layout={{
        title: { text: 'Crimes per Year' },
        xaxis: { title: { text: 'Year' }, type: 'category', automargin: true },
        yaxis: { title: { text: 'Total Incidents' }, automargin: true },
        autosize: true,
        height: 400,
        margin: { t: 50, b: 50, l: 50, r: 20 },
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default YearChart;
