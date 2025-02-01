import { Modal, Image, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import pomade from '../../app/assets/images/pomad_small.png';
import logo from '../../app/assets/images/pomade-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import '../../styles/modals/modal.scss';
import { useContext } from 'react';
import ProductContext from '../../ProductContext';

const PomadeSale = ({ showModal, onClose }) => {
  const { 
    view,
    setView,
    cartCount, 
    addToCart, 
    subTotal, 
    handleDecrement, 
    handleIncrement, 
    handleCheckout,
    handleGoBack,
    check,
    setCheck,
    pomadeProductId,
    goToCart,
    quantity,
  } = useContext(ProductContext);

  const transitions = useTransition(showModal, {
    from: { opacity: 0, transform: 'translateY(-50%)' },
    enter: { opacity: 1, transform: 'translateY(0%)' }, 
    leave: { opacity: 0, transform: 'translateY(-50%)' },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const viewTransitions = useTransition(view, {
    key: view,
    from: { opacity: 0, transform: 'translateX(-100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const handleAddToCart = (event) => {
    event.preventDefault();
    const itemData = {
        id: pomadeProductId, 
        product: 'Blessed Pomade',
        price: 13.99, 
        quantity: quantity  
    };
    addToCart(event, itemData);
};

const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckout();
}

  return transitions((styles, item) => item && (
    <Modal 
      show={showModal}
      onHide={onClose}
      size="sm" 
      className="sale-modal"
      style={{ zIndex: 1070 }}
    >
      <animated.div style={styles}>
        <Modal.Dialog className="modal-container">
          <Modal.Header className="modalHeader" closeButton>
            <Image className="pomade-logo" src={logo} alt="blessed pomade logo"/>
            <Modal.Title className="modal-title">Blessed Pomade</Modal.Title>
          </Modal.Header>
          <Modal.Body 
            className="sale-modal-body"
            style={{
              position: 'relative',
              overflow: 'auto',
              maxHeight: 'calc(100vh - 120px)',
            }}
          >
          {
            viewTransitions((styles, item) => (
              <animated.div
                className="animate-div"
                style={{
                  ...styles,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
              {item === 'product' ? (
                <div className="product-card">
                  {
                    cartCount > 0 && (
                      <div className="cart-items">
                        <FontAwesomeIcon className="cart-icon" icon={faShoppingCart} size="2x" />
                        <span className="cart-count">{cartCount}</span>
                        <Button 
                          type="button" 
                          className="cart-btn"
                          onClick={goToCart} 
                        >
                          Go to Cart
                        </Button> 
                      </div>
                    )}
                    <Image 
                      className="product-img"
                      src={pomade}
                      alt="Blessed Pomade hair pomade product"
                    />
                    <div className="product-details">
                      <p className="product-title">
                        Blessed Pomade 
                        <span className="weight">4.25OZ</span>
                      </p>
                      <p className="product-price">$13.99</p>
                      <Button 
                        className="product-btn"
                        onClick={handleAddToCart} 
                      >
                        Add to Cart
                      </Button>
                    </div>
                </div>
              ) : (
                <div className="cart-product-card">
                  <Image 
                    className="product-img"
                    src={pomade}
                    alt="Blessed Pomade hair pomade product"   
                  />
                  <p className="product-title">
                    Blessed Pomade
                    <span className="weight">4.25OZ</span>
                  </p>
                  <div className="cart-details">
                    <div className="cart-item">
                      <p>Product Price</p>
                      <p>$13.99</p>
                    </div>
                    <div className="cart-item">
                      <p>Subtotal</p>
                      <p>${subTotal.toFixed(2)}</p>
                    </div>
                    <div className="cart-item">
                      <p>Quantity</p>
                      <p className="cart-price">{cartCount}</p>
                    </div>
                    <div className="cart-item quantity-control">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => handleDecrement('pomade')} // Pass the item ID
                        className="quantity-btn"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                      <span className="cart-count">{cartCount}</span>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => handleIncrement('pomade')} // Pass the item ID
                        className="quantity-btn"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                    <Form className="cart-form" onSubmit={handleSubmit}>
                      <Form.Check 
                        label={
                          <a href="/terms" className="term-link">Accept terms and conditions</a>
                        }
                        name="accept"
                        type="checkbox"
                        checked={check}
                        onChange={() => setCheck(!check)}
                        className="cart-check"
                      />
                      <div className="cart-buttons">
                        <Button 
                          className="cart-btn"
                          type="submit" 
                          disabled={!check}
                        >
                          Checkout
                        </Button>
                        <Button 
                          className="cart-btn"
                          onClick={handleGoBack}
                        >
                          Go Back
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              )}
              </animated.div>
            ))
          }
          </Modal.Body>
        </Modal.Dialog>
      </animated.div>
    </Modal>
  ));
};

export default PomadeSale;