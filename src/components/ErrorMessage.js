import { Container } from 'react-bootstrap';
const ErrorMessage = ({ message }) => {
    return (
        <Container>
            {message || "Something went wrong. Please try again later."}
        </Container>
    );
};

export default ErrorMessage;