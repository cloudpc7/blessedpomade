import { Container, Row, Col } from 'react-bootstrap';
import "../styles/home/faqs/faqs.scss";

const Faqs = () => {
    const faqList = [
        { question: "What is water-based pomade?", answer: "Water-based pomade is a styling product primarily made with water as its base, offering a hold that's easy to wash out. It's perfect for those who want control and shine without the greasy residue associated with traditional pomades." },
        { question: "How does Blessed Pomade differ from oil-based pomades?", answer: "Unlike oil-based pomades, which provide a strong hold and high shine but can be harder to wash out, Blessed Pomade is water-based. This means it washes out easily, doesn't leave your hair feeling greasy, and is generally better for daily use or for those with finer hair." },
        { question: "Can I use water-based pomade on all hair types?", answer: "Yes, Blessed Pomade is designed for all hair types. Its water base makes it adaptable, providing enough hold for thick, curly hair, while not weighing down fine or straight hair." },
        { question: "Is Blessed Pomade safe for dyed or treated hair?", answer: "Absolutely. Blessed Pomade uses natural ingredients, avoiding harsh chemicals that could harm dyed or treated hair. Its water-based formula is gentle, ensuring your hair color remains vibrant." },
        { question: "How long does the hold last with Blessed Pomade?", answer: "The hold of Blessed Pomade can last all day for most activities, though it's less resilient in very humid conditions or during heavy physical activity. Its strength is in its natural hold and ease of restyling throughout the day." },
    ];

    return (
        <Container fluid className="faqs-container">
            <Row className="faqs-row">
                <Col xs={12} className="faq-grid">
                        <h2 className="h2 faqs-title">FAQs About Blessed Pomade</h2>
                    {faqList.map((faq, index) => (
                        <div key={index} className={`faq-item faq-item-${index + 1}`}>
                            <h3 className="h3 faq-question">{faq.question}</h3>
                            <p className="faq-answer">{faq.answer}</p>
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default Faqs;