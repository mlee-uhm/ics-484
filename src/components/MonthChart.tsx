'use client';

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
  // eslint-disable-next-line react/require-default-props
  title?: string;
}

const MonthChart: React.FC<ChartProps> = ({ data, title = 'Crimes per Month' }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { x: [], y: [] };

    // Group by Month (01 to 12)
    // Assumes dispatch_date format YYYY-MM-DD
    const monthCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => {
        const date = new Date(d.dispatch_date);
        return date.getMonth(); // 0 = Jan, 11 = Dec
      },
    );

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // Ensure all 12 months are present, even if count is 0
    const x = monthNames;
    const y = monthNames.map((_, index) => monthCounts.get(index) || 0);

    return { x, y };
  }, [data]);

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: chartData.x,
          y: chartData.y,
          marker: { color: '#82ca9d' },
        },
      ]}
      layout={{
        title: { text: title },
        xaxis: { title: { text: 'Month' }, automargin: true },
        yaxis: { title: { text: 'Incidents' }, automargin: true },
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

export default MonthChart;
