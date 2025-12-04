'use client';

/* eslint-disable max-len */
import { Container, Row } from 'react-bootstrap';
import React from 'react';
import dynamic from 'next/dynamic';

const ScatterMap = dynamic(() => import('../components/ScatterMap'), {
  ssr: false,
});

/** Edit this page */
const Home = () => (
  <Container className="">
    <Row className="justify-content-center">
      <div className="d-flex justify-content-center">
        <ScatterMap />
      </div>
    </Row>
  </Container>
);

export default Home;
