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

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => {
        if (!d.dispatch_date) return -1;
        // FIX: Append "T12:00:00" to force the date to Noon.
        // Even if timezone shifts by -5 or -8 hours, it stays on the same day.
        return new Date(`${d.dispatch_date}T12:00:00`).getDay();
      },
    );

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
        marker: { color: '#ffc658' },
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
