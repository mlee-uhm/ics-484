/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { Container, Navbar, NavbarText, Nav, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import AboutCard from './AboutCard';
import MissionCard from './MissionCard';

const NavBar: React.FC = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showMission, setShowMission] = useState(false);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Team 67ers</Navbar.Brand>

          <div className="position-absolute start-50 translate-middle-x d-none d-lg-block">
            <NavbarText className="">
              Philadelphia Crime Data Visualization
            </NavbarText>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link onClick={() => setShowAbout(true)}>About</Nav.Link>
              <Nav.Link onClick={() => setShowMission(true)}>Mission</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showAbout} onHide={() => setShowAbout(false)}>
        <Modal.Header closeButton>
          <Modal.Title>About This Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AboutCard />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAbout(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMission} onHide={() => setShowMission(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Our Mission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MissionCard />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMission(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavBar;
