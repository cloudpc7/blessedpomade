import { Container, Navbar, Nav, Offcanvas, Image } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import pomadeLogo from '../app/assets/images/pomade-logo.png';
import { Tooltip } from 'reactstrap';
import '../styles/header/header.scss';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { Navigate, useNavigate } from 'react-router-dom';
library.add(fas);
const Header = () => {
    const navigate = useNavigate();
    const { goToCart, cartCount} = useContext(ProductContext);
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
                            <Nav.Link  onClick={() => Navigate('/')} className="link" alt="home"> 
                                <FontAwesomeIcon id="home" icon="fa-house" size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={home}
                                    target="home"
                                    toggle={toggleHome}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    Home
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link id="shop" href="#cart-section"  className="link shop" alt="shop"> 
                                shop
                                <Tooltip
                                    placement="bottom"
                                    isOpen={shop}
                                    target="shop"
                                    toggle={toggleShop}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    shop
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link id="cart" href="#cart-section" onClick={goToCart} className="link" alt="shopping cart"> 
                                <FontAwesomeIcon icon="fa-cart-shopping" size="2x" />
                                <span className="cart-count">{cartCount}</span>
                                <Tooltip
                                    placement="bottom"
                                    isOpen={cart}
                                    target="cart"
                                    toggle={toggleCart}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    shopping cart
                                </Tooltip> 
                            </Nav.Link>
                            <Nav.Link id="phone" href="tel:+9515028296" className="link" alt="phone"> 
                                <FontAwesomeIcon icon="fa-phone" size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={phone}
                                    target="phone"
                                    toggle={togglePhone}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    phone
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link id="mail" href="mailto:alex.85marroquin@gmail.com" className="link" alt="mail"> 
                                <FontAwesomeIcon icon="fa-envelope" size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={mail}
                                    target="mail"
                                    toggle={toggleMail}
                                    className="custom-tooltip"
                                    transition={{ timeout: 300}}
                                >
                                    email
                                </Tooltip>
                            </Nav.Link>
                            <Nav.Link  
                                id="instagram" 
                                onClick={() => navigate('https://instagram.com')}
                                className="link" 
                                alt="instagram"
                            > 
                                <FontAwesomeIcon icon={faInstagram} size="2x" /> 
                                <Tooltip
                                    placement="bottom"
                                    isOpen={instagram}
                                    target="instagram"
                                    toggle={toggleInstagram}
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