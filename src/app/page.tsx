'use client';

/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import * as d3 from 'd3';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

// FIX: Dynamically load ALL Plotly components with ssr: false
// This prevents "ReferenceError: self is not defined" during server rendering

const ChoroplethMap = dynamic(() => import('@/components/ChoroplethMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      Loading Choropleth Map...
    </div>
  ),
});

const ScatterMap = dynamic(() => import('@/components/ScatterMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      Loading Scatter Map...
    </div>
  ),
});

const HourlyChart = dynamic(() => import('@/components/HourlyChart'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      Loading Charts...
    </div>
  ),
});

const Home = () => {
  // 1. State to track the active view
  const [currentView, setCurrentView] = useState<'choropleth' | 'bar' | 'scatter'>('choropleth');

  // 2. State for data (needed for the Bar Chart)
  const [data, setData] = useState<any[]>([]);

  // Fetch data for the bar chart
  useEffect(() => {
    d3.csv('/cartodb-query_1.csv').then((csvData) => {
      setData(csvData);
    });
  }, []);

  // 3. Helper to render the correct component
  const renderContent = () => {
    switch (currentView) {
      case 'choropleth':
        return <ChoroplethMap />;
      case 'scatter':
        return <ScatterMap />;
      case 'bar':
        // The bar chart needs data passed to it
        return <HourlyChart data={data} />;
      default:
        return <ChoroplethMap />;
    }
  };

  return (
    <Row className="g-0" style={{ height: '100vh' }}>
      <Col xs="auto">
        {/* Pass the setter function to the Sidebar */}
        <Sidebar onViewChange={setCurrentView} />
      </Col>
      <Col style={{ height: '100vh', overflow: 'hidden' }}>
        {renderContent()}
      </Col>
    </Row>
  );
};

export default Home;
