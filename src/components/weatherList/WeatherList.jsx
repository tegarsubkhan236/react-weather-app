import {Card, Col, Image, Row, Stack} from "react-bootstrap";

function WeatherList({
                         index,
                         activeIndex,
                         handleActiveIndex,
                         weather_day,
                         weather_time,
                         temperature,
                         real_temperature,
                         wind,
                         pressure,
                         humidity,
                         weather_icon,
                         weather_icon_desc,
                         weather_sunrise,
                         weather_sunset
                     }) {

    function capitalizeFirstLetterOfEachWord(text) {
        return text.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    return (
        <Card
            key={index}
            className={`flex-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleActiveIndex(index)}
        >
            {index === activeIndex ? (
                <>
                    {/*TODO FIX THIS*/}
                    <Card.Header className="m-0" style={{backgroundColor: "#AECADF", color: 'black'}}>
                        <Stack direction="horizontal">
                            <p>{weather_day}</p>
                            <p className="ms-auto">{weather_time}</p>
                        </Stack>
                    </Card.Header>
                    <Card.Body className="pt-1 pb-1" style={{backgroundColor: "#BBD7EC", color: 'black'}}>
                        <Row>
                            <Col md={6}>
                                <Card.Title>{temperature}°C</Card.Title>
                                <Card.Text style={{fontSize: '12px'}}>
                                    <span>Real Feel {real_temperature}°C</span><br/>
                                    <span>Wind N-E {wind} Km/h</span><br/>
                                    <span>Pressure {pressure} hPa</span><br/>
                                    <span>Humidity {humidity}%</span>
                                </Card.Text>
                            </Col>
                            <Col md={6} className="text-end">
                                <Image src={weather_icon} width={60} height={60}/>
                                <Card.Subtitle style={{whiteSpace: 'nowrap'}}>
                                    {capitalizeFirstLetterOfEachWord(weather_icon_desc)}
                                </Card.Subtitle>
                                <Card.Text style={{fontSize: '12px'}}>
                                    Sunrise {weather_sunrise} <br/>
                                    Sunset {weather_sunset}
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </>
            ) : (
                <>
                    <Card.Header>{weather_day}</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={12} className="text-center">
                                <Image src={weather_icon} width={50} height={50}/>
                                <Card.Text style={{fontSize: '25px'}}>{temperature}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </>
            )}
        </Card>
    );
}

export default WeatherList;