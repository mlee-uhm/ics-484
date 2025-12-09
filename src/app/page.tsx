'use client';

/* eslint-disable max-len */
import { Row, Col } from 'react-bootstrap';
import React from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import ChoroplethMap from '@/components/ChoroplethMap';

/** Edit this page */
const Home = () => (
  <Row className="g-0" style={{ height: '100vh' }}>
    <Col xs="auto">
      <Sidebar />
    </Col>
    <Col style={{ height: '100vh', overflow: 'hidden' }}>
      <ChoroplethMap />
    </Col>
  </Row>
);

export default Home;
