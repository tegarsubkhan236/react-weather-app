import {Card, Image} from "react-bootstrap";

function WeatherOverview({title, value, unit, image}) {
    return (
        <Card style={{height: '165px'}}>
            <Card.Body className="d-flex flex-column">
                <div className="mb-auto">
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                        <b>{value}</b> {unit}
                    </Card.Text>
                </div>
                <div className="d-flex justify-content-center">
                    <Image src={image} style={{maxWidth: '100%', height: 'auto'}}/>
                </div>
            </Card.Body>
        </Card>
    );
}

export default WeatherOverview;