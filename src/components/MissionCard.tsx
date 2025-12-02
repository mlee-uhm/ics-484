import Card from 'react-bootstrap/Card';
import React from 'react';

const MissionCard: React.FC = () => (
  <Card className="my-4">
    <Card.Body>
      <Card.Text>
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
        </p>
        <ul className="fw-bold">
          <li>Provide transparency around crime data in Philadelphia</li>
          <li>Help local residents understand crime trends in their communities</li>
          <li>Support policymakers and law enforcement in making informed decisions</li>
          <li>Supply researchers with information about crime patterns and factors</li>
        </ul>
        <p>
          Our mission is to make reliable information available to everyone working
          to build a safer Philadelphia.
        </p>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default MissionCard;
