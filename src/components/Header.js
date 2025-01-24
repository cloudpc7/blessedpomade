import { Container, Navbar, Nav, Offcanvas, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import pomadeLogo from '../app/assets/images/pomade-logo.png';
import { Tooltip } from 'reactstrap';
import '../styles/header/header.scss';

library.add(fas);
const Header = () => {
    const [home, setHome] = useState(false);
    const [shop, setShop] = useState(false);
    const [cart, setCart] = useState(false);
    const [phone, setPhone] = useState(false);
    const [mail, setMail] = useState(false);
    const [instagram, setInstagram] = useState(false);

    const toggleHome = () => setHome((prev) => !prev);
    const toggleShop = () => setShop((prev) => !prev);
    const toggleCart = () => setCart((prev) => !prev);
    const togglePhone = () => setPhone((prev) => !prev);
    const toggleMail = () => setMail((prev) => !prev);
    const toggleInstagram = () => setInstagram((prev) => !prev);

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Toggle
                    aria-controls="offcanvasNavbar-expand-lg"
                />
                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-md"
                    aria-labelledby="offcanvasnavbar-expand-lg"
                    placement="start"
                >
                    <Offcanvas.Header closeButton>
                        <Image className='pomade' src={pomadeLogo} alt='praying hands with blue background' />
                            <h2 className="nav-title">Blessed Pomade</h2>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="navbar-nav"> 
                            <Nav.Link  href="/" className="link" alt="home"> 
                                <FontAwesomeIcon id="home" icon="fa-house" size="2x" /> 
                                <Tooltip
                                    placement="right"
                                    isOpen={home}
                                    target="home"
                                    toggle={toggleHome}
                                >
                                    Home
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link id="shop" href="/" className="link shop" alt="shop"> 
                                shop
                                <Tooltip
                                    placement="right"
                                    isOpen={shop}
                                    target="shop"
                                    toggle={toggleShop}
                                >
                                    shop
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link id="cart" href="/" className="link" alt="shopping cart"> 
                                <FontAwesomeIcon icon="fa-cart-shopping" size="2x" />
                                <Tooltip
                                    placement="right"
                                    isOpen={cart}
                                    target="cart"
                                    toggle={toggleCart}
                                >
                                    shopping cart
                                </Tooltip> 
                            </Nav.Link>
                            <Nav.Link id="phone" href="/" className="link" alt="phone"> 
                                <FontAwesomeIcon icon="fa-phone" size="2x" /> 
                                <Tooltip
                                    placement="right"
                                    isOpen={phone}
                                    target="phone"
                                    toggle={togglePhone}
                                >
                                    phone
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link id="mail" href="/" className="link" alt="mail"> 
                                <FontAwesomeIcon icon="fa-envelope" size="2x" /> 
                                <Tooltip
                                    placement="right"
                                    isOpen={mail}
                                    target="mail"
                                    toggle={toggleMail}
                                >
                                    email
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link  
                                id="instagram" 
                                href="https://instagram.com" 
                                className="link" 
                                alt="instagram"
                            > 
                                <FontAwesomeIcon icon={faInstagram} size="2x" /> 
                                <Tooltip
                                    placement="right"
                                    isOpen={instagram}
                                    target="instagram"
                                    toggle={toggleInstagram}
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