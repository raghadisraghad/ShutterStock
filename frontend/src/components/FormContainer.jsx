import { Container, Row, Col } from 'react-bootstrap';



const FormContainer = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default FormContainer;