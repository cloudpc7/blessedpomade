import { Container, Row, Col } from 'react-bootstrap';
import "../styles/home/faqs/faqs.scss";

const Faqs = () => {
    return (
        <Container className="faqs-container">
            <Row className="faqs-row">
                <Col xs={12} className="faqs-col">
                    <h2 className="h2 faqs-title">FAQs About Blessed Pomade</h2>
                </Col>
                <Col xs={12} className="faq-item">
                    <h3 className="h3 faq-question">What is water-based pomade?</h3>
                    <p className="faq-answer">
                        Water-based pomade is a styling product primarily made with water as its base, offering a hold that's easy to wash out. It's perfect for those who want control and shine without the greasy residue associated with traditional pomades.
                    </p>
                </Col>
                <Col xs={12} className="faq-item">
                    <h3 className="h3 faq-question">How does Blessed Pomade differ from oil-based pomades?</h3>
                    <p className="faq-answer">
                        Unlike oil-based pomades, which provide a strong hold and high shine but can be harder to wash out, Blessed Pomade is water-based. This means it washes out easily, doesn't leave your hair feeling greasy, and is generally better for daily use or for those with finer hair.
                    </p>
                </Col>
                <Col xs={12} className="faq-item">
                    <h3 className="h3 faq-question">Can I use water-based pomade on all hair types?</h3>
                    <p className="faq-answer">
                        Yes, Blessed Pomade is designed for all hair types. Its water base makes it adaptable, providing enough hold for thick, curly hair, while not weighing down fine or straight hair.
                    </p>
                </Col>
                <Col xs={12} className="faq-item">
                    <h3 className="h3 faq-question">Is Blessed Pomade safe for dyed or treated hair?</h3>
                    <p className="faq-answer">
                        Absolutely. Blessed Pomade uses natural ingredients, avoiding harsh chemicals that could harm dyed or treated hair. Its water-based formula is gentle, ensuring your hair color remains vibrant.
                    </p>
                </Col>
                <Col xs={12} className="faq-item">
                    <h3 className="h3 faq-question">How long does the hold last with Blessed Pomade?</h3>
                    <p className="faq-answer">
                        The hold of Blessed Pomade can last all day for most activities, though it's less resilient in very humid conditions or during heavy physical activity. Its strength is in its natural hold and ease of restyling throughout the day.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Faqs;