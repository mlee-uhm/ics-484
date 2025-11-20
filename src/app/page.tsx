'use client';

/* eslint-disable max-len */
import { Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import ScatterMap from '@/components/ScatterMap';

/** Edit this page */
const Home = () => (
  <Container className="my-5">
    <Row className="justify-content-center">
      <Col md={9}>
        <div className="d-flex flex-column align-items-center">
          <h1 className="text-center mb-4">Philadelphia Crime</h1>
          <div title="about-us">
            <h3 className="text-center mb-4">About Us</h3>
            <p>
              We are a team of students at the University of Hawai&apos;i at Manoa.
              This project was created as a part of the coursework for ICS 484 - Data Visualization,
              taught by Professor Nurit Kirshenbaum. We are passionate about using the data to create
              meaningful visualizations that can help inform and educate the public about crime trends
              in Philadelphia. The data was collected from the official website for the City of Philadelphia&apos;s
              government. The source of the data can be found here at:&nbsp;
              <br />
              <a href="https://data.phila.gov/visualizations/crime-incidents">https://data.phila.gov/visualizations/crime-incidents</a>
            </p>
            <p>
              Team Members:
              <ul>
                <li>Hunter Von Tungeln - Team Lead</li>
                <li>Tyler Mak - Data Scientist</li>
                <li>Michael Lee - Front End Designer</li>
              </ul>
            </p>
          </div>
          <div title="our-mission">
            <h3 className="text-center mb-4">Our Mission</h3>
            <p>
              Philadelphia’s relationship with crime is rooted in its history and constantly evolving,
              affecting daily life across neighborhoods.
            </p>
            <p>
              This site provides clear, accurate, and accessible data through statistics,
              interactive visualizations, and context-driven analysis.
            </p>
            <p>
              The goal of this website is to:
              <ul>
                <li>Provide transparency around crime data in Philadelphia</li>
                <li>Help local residents understand crime trends in their communities</li>
                <li>Support policymakers and law enforcement in making informed decisions</li>
                <li>Supply researchers with information about crime patterns and factors</li>
              </ul>
            </p>
            <p>
              Our mission is to make reliable information available to everyone working
              to build a safer Philadelphia.
            </p>
          </div>
          <div title="visualizations">
            <h3 className="text-center mb-4">Visualizations</h3>
            <div style={{ width: '100%', height: '600px' }}>
              <ScatterMap />
            </div>
          </div>
          <div title="analysis-and-trends">
            <h3 className="text-center mb-4">Analysis and Trends</h3>
          </div>
          <div title="next-steps">
            <h3 className="text-center mb-4">Next Steps</h3>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Home;
