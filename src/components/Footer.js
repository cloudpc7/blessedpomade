import { Row, Col, Image } from 'react-bootstrap';
import pomadeLogo from '../app/assets/images/pomade-logo.png';
import '../styles/footer/footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <footer id="footer" className="footer">
            <div className="business-image">
                <Image className="blessed-logo" src={pomadeLogo} alt="praying hand on top of a blue background"/>
                <h3 className="h3 blessed-title">Blessed Pomade</h3>
            </div>
            <Row className="footer-content">
                <Col className="social-section">
                    <h5 className="h5 footer-title">Follow Us</h5>
                    <a href="https://instagram.com/clouddropdesigns" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                </Col>
                <Col className="about-section">
                    <h5 className="h5 footer-title">About</h5>
                    <ul className="footer-list">
                        <li>Product</li>
                        <li>Blessed Pomade</li>
                        <li>Website</li>
                    </ul>
                </Col>
                <Col className="contact-section">
                    <h5 className="h5 footer-title">Contact</h5>
                    <Link 
                        className="email-link" 
                        to="mailto:alex.85marroquin@gmail.com"
                    >
                        Alex
                    </Link>
                </Col>
                <Col className="policy-section">
                    <h5 className="h5 footer-title">Info</h5>
                    <ul className="footer-list">
                        <li>Privacy Policy</li>
                        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
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