import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
const Buy = () => {
    return (
        <Formik>
            <Form>
                <Button type="submit">Submit</Button>
            </Form>
        </Formik>
    );
};

export default Buy;