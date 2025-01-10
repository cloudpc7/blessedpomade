import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ButtonGroup } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const PomadeSale = () => {
    const [count, setCount] = useState(0);
    const [touched, setTouched] = useState(false);

    const handleChange = () => {

    }

    const handleSubmit = (event) => {
    }

    const handleDecrement = () => {
        console.log('clicked');
    }

    const handleIncrement = () => {
        console.log('clicked');
    }

    return (

        <Formik initialValues={{
            firstName: ''
            }}
        >
            <Form>
                <Form.Group row>
                    <Form.Label htmlFor='firstName'>
                        first Name
                    </Form.Label>
                    <Col>
                        <Field className='form-control' name='firstName' placeholder='First Name' />
                        <ErrorMessage name='firstName'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Col>
                </Form.Group>
            </Form>
        </Formik>
        // <Container>
        //     <Row>
        //         <Col>
        //             <h3>shipping information</h3>
        //         </Col>
        //         <Col>
        //             <Card>
        //                 <Card.Title></Card.Title>
        //                 <Card.Img />
        //                 <Card.Body>
        //                     <Card.Text></Card.Text>
        //                     <ButtonGroup className="product-count" aria-label="product count">
        //                         <Button onClick={handleDecrement}>-</Button>
        //                         <Button>{count}</Button>
        //                         <Button onClick={handleIncrement}>+</Button>
        //                     </ButtonGroup>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //         <Col>
        //         </Col>
        //     </Row>
        // </Container>
    )
}

export default PomadeSale;