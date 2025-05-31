import { useState, useEffect, useCallback } from 'react';
import { useSpringCarousel } from 'react-spring-carousel';
import { Container, Image } from 'react-bootstrap';
import '../styles/home/testament/testament.scss';
import hairstyle1 from '../app/assets/images/hairstyle1.png';
import hairstyle2 from '../app/assets/images/hair2.png';
import hairstyle3 from '../app/assets/images/hair3.png';
import ClientCard from './ClientCard';
const Testament = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [itemsPerSlide, setItemsPerSlide] = useState(1);

    const testament = [
        {
            id: 1,
            name:  "John D.",
            image: hairstyle1,
            text:  "Blessed Pomade has transformed my hair routine. No more greasy feeling, just fresh, stylish hair all day!"
        },
        {
            id: 2,
            name:  "John D.",
            image: hairstyle2,
            text:  "Blessed Pomade has transformed my hair routine. No more greasy feeling, just fresh, stylish hair all day!"
        },
        {
            id: 3,
            name:  "John D.",
            image: hairstyle3,
            text:  "Blessed Pomade has transformed my hair routine. No more greasy feeling, just fresh, stylish hair all day!"
        },
    ]

    useEffect(() => {
        const updateItemsPerSlide = () => {
            const width = window.innerWidth;
            if(width < 768) {
                setItemsPerSlide(1);
            } else if (width < 992) {
                setItemsPerSlide(2);
            } else {
                setItemsPerSlide(3);
            }
        };
        updateItemsPerSlide();
        window.addEventListener('resize', updateItemsPerSlide);
        return () => window.removeEventListener('resize', updateItemsPerSlide);
      }, [itemsPerSlide]);
    const { carouselFragment } = useSpringCarousel({
        itemsPerslide: itemsPerSlide,
        withLoop: true,
        items: testament.map((testament, index) => ({
            id: index.toString(),
            renderItem: (
                <div key={testament.id} className="use-spring-carousel-wrapper">
                    <ClientCard testament={testament}/>
                </div>
            )
        }))
            
    });

    return (
        <Container id="testaments" className="testament-container">
            <h2 className="h2 testament-title">What Clients Say</h2>
            <div className="carousel">
                {carouselFragment}
            </div>
        </Container>
    );
};

export default Testament;