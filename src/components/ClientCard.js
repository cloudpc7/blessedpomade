import { Card } from 'react-bootstrap';
import '../styles/home/testament/testament.scss';

const ClientCard = ({testament}) => {
    const {id, name, image ,text} = testament;
    return (
        <Card className="testament-card">
            <Card.Img className="testament-img" src={image} alt={`Client ${name}`}/>
            <Card.ImgOverlay>
                <Card.Body className="testament-body">
                    <Card.Text className="testament-text">
                        {text}
                    </Card.Text>
                    <Card.Text className="testament-name">
                    - {name}
                    </Card.Text>
                </Card.Body>
            </Card.ImgOverlay>
        </Card>
    )
}

export default ClientCard;