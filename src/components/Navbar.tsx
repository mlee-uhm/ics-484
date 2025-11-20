/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { Container, Navbar } from 'react-bootstrap';

const NavBar: React.FC = () => (
  <Navbar bg="light" expand="lg">
    <Container>
      <Navbar.Brand href="/">Team 67ers</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Container>
  </Navbar>
);

export default NavBar;
