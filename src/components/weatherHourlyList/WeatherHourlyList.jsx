import {Image, ListGroup} from "react-bootstrap";
import {CapitalizeFirstLetterOfEachWord} from "../../helper/converter.js";

const WeatherHourlyList = ({weatherDataHourly, activeHourlyIndex, handleActiveHourlyIndex}) => {
    return (
        <div style={{maxHeight: '53vh', overflowY: 'auto'}}>
            <ListGroup as="ol" defaultActiveKey={activeHourlyIndex}>
                {weatherDataHourly.map((item, index) => (
                    <ListGroup.Item
                        as="li"
                        key={index}
                        action
                        onClick={() => handleActiveHourlyIndex(index)}
                        className="d-flex justify-content-between align-items-center"
                        active={index === activeHourlyIndex}
                    >
                        <div className="ms-2 me-auto">
                            {item.weather_day} {item.weather_time}<br/>
                            <div className="fw-bold">{CapitalizeFirstLetterOfEachWord(item.weather_icon_desc)} {item.temperature}°C</div>
                        </div>
                        <Image src={item.weather_icon} width={60} height={60}/>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default WeatherHourlyList;