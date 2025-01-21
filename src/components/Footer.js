import { Row, Col, Image } from 'react-bootstrap';
import pomadeLogo from '../app/assets/images/pomade-logo.png';
import '../styles/footer/footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <footer className="footer">
            <div className="business-image">
                <Image className="blessed-logo" src={pomadeLogo} alt="praying hand on top of a blue background"/>
                <h4 className="h4 blessed-title">Blessed Pomade</h4>
            </div>
            <Row className="footer-content">
                <Col className="social-section">
                    <h4 className="h4 footer-title">Follow Us</h4>
                    <a href="https://instagram.com/clouddropdesigns" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                </Col>
                <Col className="about-section">
                    <h4 className="h4 footer-title">About</h4>
                    <ul className="footer-list">
                        <li>Product</li>
                        <li>Blessed Pomade</li>
                        <li>Website</li>
                    </ul>
                </Col>
                <Col className="contact-section">
                    <h4 className="h4 footer-title">Contact</h4>
                    <Link 
                        className="email-link" 
                        href="mailto:alex.85marroquin@gmail.com"
                    >
                        alex.85marroquin@gmail.com
                    </Link>
                </Col>
                <Col className="policy-section">
                    <h4 className="h4 footer-title">Info</h4>
                    <ul className="footer-list">
                        <li>Privacy Policy</li>
                        <li>Site Map</li>
                        <li>Terms & Conditions</li>
                        <li>Accessibility</li>
                        <li>California Privacy Policy</li>
                    </ul>
                </Col>
            </Row>
            <Row className="footer-copyright">
                <Col className="copyright-section">
                    <p className="copyright">
                        ©2025 BlessedPomade. All Rights Reserved
                    </p>
                </Col>
                <Col className="developer-section">
                    <p className="developer-copyright">
                        Site created by<br />
                        <Link to="https://clouddropdesigns.com">Clouddropdesigns.com</Link>
                    </p>
                    <p className="copyright"><span className="copy-right-logo">©</span>2025 all rights reserved</p>
                </Col>
            </Row>
        </footer>
    );
};

export default Welcome;