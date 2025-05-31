import { Container, Navbar, Nav, Offcanvas, Image } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import pomadeLogo from '../app/assets/images/pomade-logo.png';
import { Tooltip } from 'reactstrap';
import '../styles/header/header.scss';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { useNavigate } from 'react-router-dom';

library.add(fas);

const Header = () => {
    const navigate = useNavigate();
    const { goToCart, cartCount } = useContext(ProductContext);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    return (
        <Navbar id="navigation" expand="lg">
            <Container>
                <Navbar.Toggle 
                    aria-controls="offcanvasNavbar-expand-lg" 
                    onClick={() => setIsOffcanvasOpen(true)}
                />
                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-md"
                    aria-labelledby="offcanvasnavbar-expand-lg"
                    placement="start"
                    show={isOffcanvasOpen}
                    onHide={() => setIsOffcanvasOpen(false)}
                >
                    <Offcanvas.Header closeButton>
                        <Image className='pomade' src={pomadeLogo} alt='praying hands with blue background' />
                        <h2 className="nav-title">Blessed Pomade</h2>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="navbar-nav"> 
                            <Nav.Link href="#home-section" onClick={() => setIsOffcanvasOpen((prev) => !prev)} className="link" id="home" alt="home"> 
                                <FontAwesomeIcon icon="fa-house" size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={false}
                                    target="home"
                                    toggle={() => {}}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    Home
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link href="#cart-section" onClick={() => setIsOffcanvasOpen((prev) => !prev)} className="link shop" id="shop" alt="shop"> 
                                shop
                                <Tooltip
                                    placement="bottom"
                                    isOpen={false}
                                    target="shop"
                                    toggle={() => {}}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    shop
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link href="#cart-section" onClick={() => setIsOffcanvasOpen((prev) => !prev)} className="link" id="cart" alt="shopping cart"> 
                                <FontAwesomeIcon icon="fa-cart-shopping" size="2x" />
                                <span className="cart-count">{cartCount}</span>
                                <Tooltip
                                    placement="bottom"
                                    isOpen={false}
                                    target="cart"
                                    toggle={() => {}}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    shopping cart
                                </Tooltip> 
                            </Nav.Link>
                            <Nav.Link onClick={() => window.location.href = 'tel:+9515028296'} className="link" id="phone" alt="phone"> 
                                <FontAwesomeIcon icon="fa-phone" size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={false}
                                    target="phone"
                                    toggle={() => {}}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    phone
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link onClick={() => window.location.href = 'mailto:alex.85marroquin@gmail.com'} className="link" id="mail" alt="mail"> 
                                <FontAwesomeIcon icon="fa-envelope" size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={false}
                                    target="mail"
                                    toggle={() => {}}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    email
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link onClick={() => window.location.href = 'https://instagram.com'} className="link" id="instagram" alt="instagram"> 
                                <FontAwesomeIcon icon={faInstagram} size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={false}
                                    target="instagram"
                                    toggle={() => {}}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    instagram
                                </Tooltip>
                            </Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}

export default Header;