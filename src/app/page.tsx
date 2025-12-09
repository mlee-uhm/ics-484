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

const HourlyChart = dynamic(() => import('@/components/HourlyChart'), {
  ssr: false,
  loading: () => <div className="p-4">Loading Hourly...</div>,
});

const CrimeTypeChart = dynamic(() => import('@/components/CrimeTypeChart'), {
  ssr: false,
  loading: () => <div className="p-4">Loading Types...</div>,
});

const YearChart = dynamic(() => import('@/components/YearChart'), {
  ssr: false,
  loading: () => <div className="p-4">Loading Years...</div>,
});

const MonthChart = dynamic(() => import('@/components/MonthChart'), {
  ssr: false,
  loading: () => <div className="p-4">Loading Months...</div>,
});

// NEW: Import DayOfWeekChart
const DayOfWeekChart = dynamic(() => import('@/components/DayOfWeekChart'), {
  ssr: false,
  loading: () => <div className="p-4">Loading Days...</div>,
});

// --- Configuration ---
const DATA_FILES = Array.from({ length: 18 }, (_, i) => `/cartodb-query_${i + 1}.csv`);

const MONTHS = [
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
  const [data, setData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- 1. Fetch & Merge Data (With Memory Optimization) ---
  useEffect(() => {
    setIsLoading(true);

    // OPTIMIZATION: Only keep columns we actually use to save memory
    const rowConverter = (d: any) => ({
      dispatch_date: d.dispatch_date, // Needed for Year/Month/Day filtering
      hour: d.hour, // Needed for HourlyChart
      text_general_code: d.text_general_code, // Needed for CrimeTypeChart
    });

    const filePromises = DATA_FILES.map((file) => d3.csv(file, rowConverter));

    Promise.all(filePromises)
      .then((allChunks) => {
        const mergedData = allChunks.flat();

        // Safety: If data is massive (over 1M rows), take latest 800k to prevent crash
        // (You can adjust this limit based on your machine's RAM)
        const finalData = mergedData.length > 800000
          ? mergedData.slice(0, 800000)
          : mergedData;

        setData(finalData);

        // Auto-select max year
        if (finalData.length > 0) {
          const allYears = finalData
            .map((d: any) => d.dispatch_date?.split('-')[0])
            .filter((y: string) => y && !Number.isNaN(Number(y)));

          if (allYears.length > 0) {
            const maxYear = allYears.reduce((max: number, y: string) => Math.max(max, Number(y)), 0);
            setSelectedYear(String(maxYear));
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading CSV files:', err);
        setIsLoading(false);
      });
  }, []);

  // --- 2. Generate Year Dropdown ---
  const years = useMemo(() => {
    if (data.length === 0) return [];
    const rawYears = data
      .map((d) => d.dispatch_date?.split('-')[0])
      .filter((y) => y && !Number.isNaN(Number(y)));

    if (rawYears.length === 0) return [];
    const maxYear = rawYears.reduce((max: number, y: string) => Math.max(max, Number(y)), 0);
    const minYear = 2006;

    const yearList: string[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      yearList.push(String(y));
    }
    return yearList;
  }, [data]);

  // --- 3. Filter Data ---

  // A. Year Data (Context for the year)
  const yearData = useMemo(() => {
    if (!selectedYear) return [];
    return data.filter(d => d.dispatch_date?.startsWith(selectedYear));
  }, [data, selectedYear]);

  // B. Specific Data (Filtered by Year AND Month)
  const filteredData = useMemo(() => {
    let d = yearData;
    if (selectedMonth) {
      d = d.filter(item => {
        const parts = item.dispatch_date?.split('-');
        return parts && parts[1] === selectedMonth;
      });
    }
    return d;
  }, [yearData, selectedMonth]);

  // --- 4. Render ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Data...</span>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'choropleth': return <ChoroplethMap />;
      case 'scatter': return <ScatterMap />;
      case 'bar':
        return (
          <div
            className="container-fluid p-4"
            style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
          >
            {/* === OVERALL SECTION === */}
            <h3 className="mb-3 text-primary fw-bold">
              Overall Trends (
              {years.length > 0 ? `${years[years.length - 1]} - ${years[0]}` : 'All Time'}
              )
            </h3>

            {/* Row 1: Long Term Trends */}
            <Row className="mb-4 g-4">
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <YearChart data={data} />
                </div>
              </Col>
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <MonthChart data={data} title="Overall Seasonality (Crimes per Month)" />
                </div>
              </Col>
            </Row>

            {/* Row 2: Timing Analysis (Day of Week & Hour) */}
            <Row className="mb-4 g-4">
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <DayOfWeekChart data={data} />
                </div>
              </Col>
              <Col lg={6} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <HourlyChart data={data} />
                </div>
              </Col>
            </Row>

            {/* Row 3: Types */}
            <Row className="mb-5 g-4">
              <Col lg={12} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <CrimeTypeChart data={data} />
                </div>
              </Col>
            </Row>

            <hr className="my-5" />

            {/* === DETAILED BREAKDOWN === */}
            <div className="d-flex align-items-center mb-3 gap-3 flex-wrap">
              <h3 className="mb-0 text-success fw-bold">Detailed Breakdown</h3>

              <Form.Select
                style={{ width: '150px', cursor: 'pointer' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>

              <Form.Select
                style={{ width: '150px', cursor: 'pointer' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Form.Select>
            </div>

            <h5 className="mb-3 text-secondary">
              Stats for:
              {' '}
              <span className="fw-bold text-dark">{selectedMonth ? `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}` : `All of ${selectedYear}`}</span>
            </h5>

            {/* Filtered Row 1: Context & Timing */}
            <Row className="mb-4 g-4">
              {/* FIX: Removed the condition so this chart ALWAYS shows */}
              <Col lg={12} className="mb-4" style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <MonthChart data={yearData} title={`Monthly Trend (${selectedYear})`} />
                </div>
              </Col>

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

            {/* Filtered Row 2: Types */}
            <Row className="g-4 pb-5">
              <Col lg={12} style={{ minHeight: '400px' }}>
                <div className="border rounded p-3 shadow-sm h-100 bg-white">
                  <CrimeTypeChart data={filteredData} />
                </div>
              </Col>
            </Row>
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
