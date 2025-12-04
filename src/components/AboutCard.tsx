import Card from 'react-bootstrap/Card';
import React from 'react';

const AboutCard: React.FC = () => (
  <Card className="my-4">
    <Card.Body>
      <Card.Text>
        <p>
          We are a team of students at the University of Hawai&apos;i at Manoa.
          This project was created as a part of the coursework for ICS 484 - Data Visualization,
          taught by Professor Nurit Kirshenbaum.
        </p>
        <p>
          We are passionate about using the data to create
          meaningful visualizations that can help inform and educate the public about crime trends
          in Philadelphia.
        </p>
        <p>
          The data was collected from the official website for the City of Philadelphia&apos;s
          government. The source of the data can be found here at:&nbsp;
          <br />
          {/* eslint-disable-next-line max-len */}
          <a href="https://data.phila.gov/visualizations/crime-incidents">https://data.phila.gov/visualizations/crime-incidents</a>
        </p>
        <p>
          Team Members:
        </p>
        <ul>
          <li>Hunter Von Tungeln - Team Lead</li>
          <li>Tyler Mak - Data Scientist</li>
          <li>Michael Lee - Front End Designer</li>
        </ul>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default AboutCard;
