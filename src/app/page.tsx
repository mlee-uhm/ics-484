'use client';

/* eslint-disable max-len */
import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import * as d3 from 'd3';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

// --- Dynamic Imports ---
const ChoroplethMap = dynamic(() => import('@/components/ChoroplethMap'), { ssr: false });
const ScatterMap = dynamic(() => import('@/components/ScatterMap'), { ssr: false });

// Components for the DETAILED section (CSV based)
const HourlyChart = dynamic(() => import('@/components/HourlyChart'), { ssr: false });
const CrimeTypeChart = dynamic(() => import('@/components/CrimeTypeChart'), { ssr: false });
// YearChart and MonthChart components are kept if you need them for specific pages,
// but for the dashboard we are using direct Plot components for the "Overall" section.
const MonthChart = dynamic(() => import('@/components/MonthChart'), { ssr: false });
const DayOfWeekChart = dynamic(() => import('@/components/DayOfWeekChart'), { ssr: false });

// Generic Plot for the OVERALL section (JSON based)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <p>Loading...</p> });

// Helper for Month Names
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_OPTS = [
  { value: '', label: 'All Months' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const Home = () => {
  const [currentView, setCurrentView] = useState<'choropleth' | 'bar' | 'scatter'>('choropleth');

  // Data States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [overallStats, setOverallStats] = useState<any>(null); // Lightweight JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [yearData, setYearData] = useState<any[]>([]); // Heavy CSV (Current Year)
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isCsvLoading, setIsCsvLoading] = useState<boolean>(false);

  // 1. Fetch Overall Stats (Fast)
  useEffect(() => {
    d3.json('/overall_stats.json').then((stats: any) => {
      setOverallStats(stats);
      // Auto-select latest year found in stats
      if (stats.years.length > 0) {
        setSelectedYear(String(stats.years[0].year));
      }
    }).catch(err => console.error('Could not load stats. Did you run process-data.js?', err));
  }, []);

  // 2. Fetch CSV when Year Changes (Lazy Load)
  useEffect(() => {
    if (!selectedYear) return;

    setIsCsvLoading(true);
    const fileName = `/crime_${selectedYear}.csv`;

    const rowConverter = (d: any) => ({
      dispatch_date: d.dispatch_date,
      hour: d.hour,
      text_general_code: d.text_general_code,
    });

    d3.csv(fileName, rowConverter).then((csvData) => {
      setYearData(csvData);
      setIsCsvLoading(false);
    }).catch((err) => {
      console.error(`Error loading ${fileName}`, err);
      setYearData([]);
      setIsCsvLoading(false);
    });
  }, [selectedYear]);

  // 3. Filter Data for Month Selection
  const filteredData = useMemo(() => {
    if (!selectedMonth) return yearData;
    return yearData.filter(d => {
      const parts = d.dispatch_date?.split('-');
      return parts && parts[1] === selectedMonth;
    });
  }, [yearData, selectedMonth]);

  const renderContent = () => {
    if (!overallStats) return <div className="p-5 text-center">Loading Dashboard...</div>;

    // FIX: Create a sorted copy of years for the chart (Ascending: 2006 -> 2025)
    // We do this here so the Dropdown can stay Descending (2025 -> 2006) for usability
    const sortedYearsAsc = [...overallStats.years].sort((a: any, b: any) => Number(a.year) - Number(b.year));

    switch (currentView) {
      case 'choropleth': return <ChoroplethMap />;
      case 'scatter': return <ScatterMap />;
      case 'bar':
        return (
          <div className="container-fluid p-4" style={{ height: '100%', overflowY: 'auto' }}>

            {/* === OVERALL SECTION (Powered by JSON) === */}
            <h3 className="mb-3 text-primary fw-bold">Overall Trends (All Time)</h3>

            <Row className="mb-4 g-4">
              {/* Yearly Trend */}
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <Plot
                    data={[{
                      type: 'bar',
                      // FIX: Use the sorted variable here
                      x: sortedYearsAsc.map((d: any) => d.year),
                      y: sortedYearsAsc.map((d: any) => d.count),
                      marker: { color: '#8884d8' },
                    }]}
                    layout={{
                      title: { text: 'Crimes per Year' },
                      autosize: true,
                      margin: { t: 50, b: 40, l: 40, r: 20 },
                      xaxis: { title: { text: 'Year' }, type: 'category' },
                    }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>
              </Col>

              {/* Monthly Seasonality */}
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <Plot
                    data={[{
                      type: 'bar',
                      x: MONTH_NAMES,
                      y: overallStats.monthly,
                      marker: { color: '#82ca9d' },
                    }]}
                    layout={{
                      title: { text: 'Overall Seasonality (Crimes per Month)' },
                      autosize: true,
                      margin: { t: 50, b: 40, l: 40, r: 20 },
                    }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mb-5 g-4">
              {/* Day of Week */}
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <Plot
                    data={[{
                      type: 'bar',
                      x: DAY_NAMES,
                      y: overallStats.days,
                      marker: { color: '#ffc658' },
                    }]}
                    layout={{
                      title: { text: 'Incidents by Day of Week' },
                      autosize: true,
                      margin: { t: 50, b: 40, l: 40, r: 20 },
                    }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>
              </Col>

              {/* Hourly */}
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <Plot
                    data={[{
                      type: 'bar',
                      x: Array.from({ length: 24 }, (_, i) => i),
                      y: overallStats.hourly,
                      marker: { color: '#3b82f6' },
                    }]}
                    layout={{
                      title: { text: 'Incidents by Hour (Overall)' },
                      autosize: true,
                      margin: { t: 50, b: 40, l: 40, r: 20 },
                      xaxis: { title: { text: 'Hour (24h)' }, dtick: 1 },
                    }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>
              </Col>
            </Row>

            <hr className="my-5" />

            {/* === DETAILED BREAKDOWN (Powered by CSV) === */}
            <div className="d-flex align-items-center mb-3 mt-5 gap-3 flex-wrap">
              <h3 className="mb-0 text-success fw-bold">Detailed Breakdown</h3>
              <Form.Select
                style={{ width: '150px' }}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                {/* Note: Dropdown uses the original descending order from JSON, which is standard UI */}
                {overallStats.years.map((y: any) => (
                  <option key={y.year} value={y.year}>{y.year}</option>
                ))}
              </Form.Select>

              <Form.Select
                style={{ width: '150px' }}
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
              >
                {MONTH_OPTS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </Form.Select>
            </div>

            {isCsvLoading ? (
              <div className="p-5 text-center text-muted">
                Loading Data for
                {selectedYear}
                ...
              </div>
            ) : (
              <>
                {/* Row 1: Monthly Trend for Year */}
                <Row className="mb-4 g-4">
                  <Col lg={12} style={{ minHeight: '400px' }}>
                    <div className="border rounded p-3 shadow-sm h-100 bg-white">
                      <MonthChart data={yearData} title={`Monthly Trend (${selectedYear})`} />
                    </div>
                  </Col>
                </Row>

                {/* Row 2: Charts for Selection */}
                <Row className="mb-4 g-4">
                  <Col lg={6} style={{ minHeight: '400px' }}>
                    <div className="border rounded p-3 shadow-sm h-100 bg-white">
                      <DayOfWeekChart data={filteredData} />
                    </div>
                  </Col>
                  <Col lg={6} style={{ minHeight: '400px' }}>
                    <div className="border rounded p-3 shadow-sm h-100 bg-white">
                      <HourlyChart data={filteredData} />
                    </div>
                  </Col>
                </Row>

                <Row className="mb-5 g-4">
                  <Col lg={12} style={{ minHeight: '400px' }}>
                    <div className="border rounded p-3 shadow-sm h-100 bg-white">
                      <CrimeTypeChart data={filteredData} />
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </div>
        );
      default: return <ChoroplethMap />;
    }
  };

  return (
    <Row className="g-0" style={{ height: '100vh' }}>
      <Col xs="auto"><Sidebar onViewChange={setCurrentView} /></Col>
      <Col style={{ height: '100vh', overflow: 'hidden' }}>{renderContent()}</Col>
    </Row>
  );
};

export default Home;
