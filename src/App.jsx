import './App.css';
import {useEffect, useState} from "react";
import {Col, Container, Image, ListGroup, Row, Spinner} from "react-bootstrap";
import Header from "./components/header/Header.jsx";
import WeatherList from "./components/weatherList/WeatherList.jsx";
import WeatherOverview from "./components/weatherOverwiew/WeatherOverview.jsx";
import WindStatus from "./assets/Wind Satus Rectangle.png";
import Humidity from "./assets/carbon_humidity-alt.png";
import axios from "axios";

// Helper function to format UNIX timestamp to AM/PM time
const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? ' PM' : ' AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}${period}`;
};

// Convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

// Convert m/s to km/h
const mpsToKmph = (mps) => (mps * 3.6).toFixed(1);

function App() {
    const API_KEY = '80b22f1cf25c49a05e196ec97eedc3aa';

    const [locationData, setLocationData] = useState({
        latitude: 0,
        longitude: 0,
        cityName: "",
        stateName: "",
        countryName: ""
    });

    const [weatherData, setWeatherData] = useState([]);
    const [weatherDataDaily, setWeatherDataDaily] = useState([]);
    const [weatherDataHourly, setWeatherDataHourly] = useState({});
    const [weatherInfo, setWeatherInfo] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLightMode, setIsLightMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeHourlyIndex, setActiveHourlyIndex] = useState(0);

    useEffect(() => {
        fetchLocationData("Purwokerto");
    }, []);

    const fetchLocationData = async (query) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`)
            const data = response.data[0];
            setLocationData({
                latitude: data.lat,
                longitude: data.lon,
                cityName: data.name,
                stateName: data.state,
                countryName: data.country
            });
            await fetchWeatherData(data.lat, data.lon);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    };

    const fetchWeatherData = async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
            const sunriseUnix = response.data.city.sunrise;
            const sunsetUnix = response.data.city.sunset;

            const sunrise = formatTime(sunriseUnix);
            const sunset = formatTime(sunsetUnix);
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            const allWeatherData = response.data.list.map(item => {
                const date = new Date(item.dt_txt);
                const dayName = daysOfWeek[date.getDay()];
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const formattedTime = `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${hours >= 12 ? 'PM' : 'AM'}`;

                return {
                    weather_day: dayName,
                    weather_time: formattedTime,
                    temperature: kelvinToCelsius(item.main.temp),
                    real_temperature: kelvinToCelsius(item.main.feels_like),
                    wind: mpsToKmph(item.wind.speed),
                    pressure: item.main.pressure,
                    humidity: item.main.humidity,
                    weather_icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    weather_icon_desc: item.weather[0].description,
                    weather_sunrise: sunrise,
                    weather_sunset: sunset,
                };
            });

            setWeatherData(allWeatherData);
            console.log(allWeatherData)

            const sameTimeData = allWeatherData.filter((item, index, arr) =>
                arr.findIndex(data => data.weather_day === item.weather_day) === index
            );
            setWeatherDataDaily(sameTimeData);
            console.log("sameTimeData", sameTimeData)

            const weatherInfo = sameTimeData[0];
            setWeatherInfo(weatherInfo)
            console.log("weatherInfo", weatherInfo)

            const hourlyData = allWeatherData.filter(item => item.weather_day === weatherInfo.weather_day);
            setWeatherDataHourly(hourlyData);
            console.log("hourlyData", hourlyData)

            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const handleActiveIndex = (index) => {
        setActiveIndex(index)
        setActiveHourlyIndex(0)

        const selectedDay = weatherDataDaily[index];
        setWeatherInfo(selectedDay)

        const hourlyData = weatherData.filter(item => item.weather_day === selectedDay.weather_day);
        setWeatherDataHourly(hourlyData);
    }

    const handleActiveHourlyIndex = (index) => {
        setActiveHourlyIndex(index)

        const selectedDay = weatherDataHourly[index]
        setWeatherInfo(selectedDay)
    }

    const toggleTheme = () => {
        setIsLightMode(prevMode => !prevMode);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchLocationData(searchQuery);
    };

    if (loading) return (
        <div className="spinner-container">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );

    if (error) return <p>Error: {error.message}</p>;


    return (
        <Container
            fluid
            className="px-3 pb-3 pt-1 bg-body"
            style={{maxHeight: '100vh', maxWidth: '100vw'}}
            data-bs-theme={isLightMode ? 'light' : 'dark'}
        >
            <Row className="gy-2">
                <Col md={12} className="bg-body-tertiary" style={{height: '8vh'}}>
                    <Header
                        toggleTheme={toggleTheme}
                        handleSearchSubmit={handleSearchSubmit}
                        isLightMode={isLightMode}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        cityName={locationData.cityName}
                        stateName={locationData.stateName}
                        countryName={locationData.countryName}
                    />
                </Col>

                <Col md={12} className="flex-container" style={{height: '25vh'}}>
                    {weatherDataDaily.map((item, index) => (
                        <WeatherList
                            key={index}
                            index={index}
                            activeIndex={activeIndex}
                            handleActiveIndex={handleActiveIndex}
                            weather_day={item.weather_day}
                            weather_time={item.weather_time}
                            temperature={item.temperature}
                            real_temperature={item.real_temperature}
                            wind={item.wind}
                            pressure={item.pressure}
                            humidity={item.humidity}
                            weather_icon={item.weather_icon}
                            weather_icon_desc={item.weather_icon_desc}
                            weather_sunrise={item.weather_sunrise}
                            weather_sunset={item.weather_sunset}
                        />
                    ))}
                </Col>

                <Col md={12} style={{height: '63vh'}}>
                    <Row className="gx-4 pt-3 pb-3">
                        <Col md={9}>
                            <h5>Today Overview</h5>
                            <Row className="gx-4 gy-3">
                                <Col md={6}>
                                    <WeatherOverview
                                        title={"Wind Status"}
                                        value={weatherInfo.wind}
                                        unit={"Km/h"}
                                        image={WindStatus}
                                    />
                                </Col>
                                <Col md={6}>
                                    <WeatherOverview
                                        title={"Humidity"}
                                        value={weatherInfo.humidity}
                                        unit={"%"}
                                        image={Humidity}
                                    />
                                </Col>
                                {/*TODO FIX THIS*/}
                                <Col md={6}>
                                    <WeatherOverview
                                        title={"Wind Status"}
                                        value={weatherInfo.wind}
                                        unit={"Km/h"}
                                        image={WindStatus}
                                    />
                                </Col>
                                <Col md={6}>
                                    <WeatherOverview
                                        title={"Humidity"}
                                        value={weatherInfo.humidity}
                                        unit={"%"}
                                        image={Humidity}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={3}>
                            <h5>Hourly Forecast</h5>
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
                                                <div className="fw-bold">{item.weather_icon_desc} {item.temperature}°C</div>
                                            </div>
                                            <Image src={item.weather_icon} width={60} height={60}/>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default App;