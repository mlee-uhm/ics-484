import { Col, Container, Image, Row } from 'react-bootstrap';
import { Paragraph } from 'react-bootstrap-icons';

/** Edit this page */
const Home = () => (
  <main>
    <Container className="my-5">
      <Row className="align-items-center">
        <Col className="text-center">
          <h1>Philadelphia Crime</h1>
          <p>
            A web application to explore crime data in Philadelphia.
          </p>
          
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
