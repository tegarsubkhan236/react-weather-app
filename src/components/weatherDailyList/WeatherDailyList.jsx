import {Card, Col, Image, Row, Stack} from "react-bootstrap";
import {CapitalizeFirstLetterOfEachWord} from "../../helper/converter.js";
import {useLanguage} from "../../context/LanguageContext.jsx";

function WeatherDailyList({
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
    const { translate } = useLanguage();

    return (
        <Card
            key={index}
            className={`flex-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleActiveIndex(index)}
        >
            {index === activeIndex ? (
                <>
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
                                    <span>{translate("real_feel")} {real_temperature}°C</span><br/>
                                    <span>{translate("wind_direction")} {wind} Km/h</span><br/>
                                    <span>{translate("pressure")} {pressure} hPa</span><br/>
                                    <span>{translate("humidity")} {humidity}%</span>
                                </Card.Text>
                            </Col>
                            <Col md={6} className="text-end">
                                <Image src={weather_icon} width={60} height={60}/>
                                <Card.Subtitle style={{whiteSpace: 'nowrap'}}>
                                    {CapitalizeFirstLetterOfEachWord(weather_icon_desc)}
                                </Card.Subtitle>
                                <Card.Text style={{fontSize: '12px'}}>
                                    <span>{translate("sunrise")} {weather_sunrise}</span><br/>
                                    <span>{translate("sunset")} {weather_sunset}</span>
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

export default WeatherDailyList;