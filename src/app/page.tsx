'use client';

/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import * as d3 from 'd3';

// Import your components
import ChoroplethMap from '@/components/ChoroplethMap';
import ScatterMap from '@/components/ScatterMap'; // Make sure this path is correct
import HourlyChart from '@/components/HourlyChart'; // Make sure this path is correct
import Sidebar from '../components/Sidebar';

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