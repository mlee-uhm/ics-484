'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Form } from 'react-bootstrap';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any; // The overall_stats.json object
}

const CrimeTrendChart: React.FC<Props> = ({ stats }) => {
  const [selectedCrime, setSelectedCrime] = useState<string>('All');

  // 1. Extract List of All Crime Types (Sorted)
  const crimeTypes = useMemo(() => {
    if (!stats || !stats.trends) return [];
    const allTypes = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(stats.trends).forEach((yearObj: any) => {
      Object.keys(yearObj).forEach(type => allTypes.add(type));
    });
    return Array.from(allTypes).sort();
  }, [stats]);

  // 2. Prepare Chart Data
  const chartData = useMemo(() => {
    if (!stats || !stats.years) return { x: [], y: [] };

    // Sort years ascending (2006 -> 2025)
    const sortedYears = [...stats.years]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((d: any) => d.year)
      .sort((a, b) => Number(a) - Number(b));

    const yValues = sortedYears.map(year => {
      if (selectedCrime === 'All') {
        // Return total for that year
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const yData = stats.years.find((y: any) => y.year === year);
        return yData ? yData.count : 0;
      }
      // Return specific crime count
      const yearTrends = stats.trends[year];
      return yearTrends ? (yearTrends[selectedCrime] || 0) : 0;
    });

    return { x: sortedYears, y: yValues };
  }, [stats, selectedCrime]);

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0 text-dark fw-bold">Long-Term Trends</h5>
        <Form.Select
          size="sm"
          style={{ width: '250px', cursor: 'pointer' }}
          value={selectedCrime}
          onChange={(e) => setSelectedCrime(e.target.value)}
        >
          <option value="All">All Crimes (Total)</option>
          {crimeTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </Form.Select>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines+markers', // Shows both the line and the dots
            x: chartData.x,
            y: chartData.y,
            line: {
              shape: 'spline',
              width: 4, // Thicker line
              color: selectedCrime === 'All' ? '#8884d8' : '#ef4444',
            },
            marker: {
              size: 10, // Increased from 6 -> 10
              symbol: 'circle',
              opacity: 1,
              line: {
                color: 'white', // White border makes them pop
                width: 2,
              },
            },
          }]}
          layout={{
            autosize: true,
            title: { text: selectedCrime === 'All' ? 'Total Incidents per Year' : `${selectedCrime} per Year` },
            margin: { t: 40, b: 40, l: 50, r: 20 },
            xaxis: { title: { text: 'Year' }, type: 'category' },
            yaxis: { title: { text: 'Count' }, automargin: true },
            hovermode: 'x unified', // Shows a nice vertical line on hover
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default CrimeTrendChart;
