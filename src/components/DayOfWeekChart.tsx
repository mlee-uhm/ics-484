'use client';

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
}

const DayOfWeekChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { x: [], y: [] };

    // 1. Define Day Order
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // 2. Group by Day Index (0 = Sunday, 1 = Monday...)
    const dayCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) =>
        // Append time to ensure local timezone doesn't shift the day
        // eslint-disable-next-line implicit-arrow-linebreak
        new Date(`${d.dispatch_date}T00:00`).getDay(),

    );

    // 3. Map counts to days (fill missing days with 0)
    const x = days;
    const y = x.map((_, i) => dayCounts.get(i) || 0);

    return { x, y };
  }, [data]);

  return (
    <Plot
      data={[{
        type: 'bar',
        x: chartData.x,
        y: chartData.y,
        marker: { color: '#ffc658' }, // Golden yellow color
      }]}
      layout={{
        title: { text: 'Incidents by Day of Week' },
        xaxis: { title: { text: 'Day' }, automargin: true },
        yaxis: { title: { text: 'Count' }, automargin: true },
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

export default DayOfWeekChart;
