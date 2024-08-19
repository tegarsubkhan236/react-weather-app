import './App.css';
import {useContext, useEffect, useState} from "react";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import Header from "./components/header/Header.jsx";
import WeatherDailyList from "./components/weatherDailyList/WeatherDailyList.jsx";
import WeatherHourlyList from "./components/weatherHourlyList/WeatherHourlyList.jsx";
import WeatherOverview from "./components/weatherOverwiew/WeatherOverview.jsx";
import WindStatus from "./assets/Wind Satus Rectangle.png";
import Humidity from "./assets/carbon_humidity-alt.png";
import axios from "axios";
import {FormatTime, KelvinToCelsius, MpsToKmph} from "./helper/converter.js";
import {API_KEY} from "./helper/constant.js";
import {ThemeContext} from "./context/ThemeContext.jsx";
import {LanguageContext} from "./context/LanguageContext.jsx";
import {getDaysOfWeek, translate} from "./helper/translation.js";

function App() {
    const { language } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);

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
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeHourlyIndex, setActiveHourlyIndex] = useState(0);

    useEffect(() => {
        fetchLocationData("Purwokerto");
    }, [language]);

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
            await fetchWeatherData(data.lat, data.lon, language);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    };

    const fetchWeatherData = async (lat, lon, language) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=${language}`);
            const sunrise = FormatTime(response.data.city.sunrise, language);
            const sunset = FormatTime(response.data.city.sunset, language);
            const daysOfWeekMap = getDaysOfWeek(language);

            const allWeatherData = response.data.list.map(item => {
                const date = new Date(item.dt_txt);
                const dayName = daysOfWeekMap[date.getDay()];
                const unixTimestamp = Math.floor(date.getTime() / 1000);

                return {
                    weather_day: dayName,
                    weather_time: FormatTime(unixTimestamp, language),
                    temperature: KelvinToCelsius(item.main.temp),
                    real_temperature: KelvinToCelsius(item.main.feels_like),
                    wind: MpsToKmph(item.wind.speed),
                    pressure: item.main.pressure,
                    humidity: item.main.humidity,
                    weather_icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    weather_icon_desc: item.weather[0].description,
                    weather_sunrise: sunrise,
                    weather_sunset: sunset,
                };
            });
            setWeatherData(allWeatherData);

            const sameTimeData = allWeatherData.filter((item, index, arr) =>
                arr.findIndex(data => data.weather_day === item.weather_day) === index
            );
            setWeatherDataDaily(sameTimeData);

            const weatherInfo = sameTimeData[0];
            setWeatherInfo(weatherInfo)

            const hourlyData = allWeatherData.filter(item => item.weather_day === weatherInfo.weather_day);
            setWeatherDataHourly(hourlyData);

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
            data-bs-theme={theme}
        >
            <Row className="gy-2">
                <Col md={12} className="bg-body-tertiary" style={{height: '8vh'}}>
                    <Header
                        handleSearchSubmit={handleSearchSubmit}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        cityName={locationData.cityName}
                        stateName={locationData.stateName}
                        countryName={locationData.countryName}
                    />
                </Col>

                <Col md={12} className="flex-container" style={{height: '25vh'}}>
                    {weatherDataDaily.map((item, index) => (
                        <WeatherDailyList
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
                            <h5>{translate("weather_overview", language)}</h5>
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
                                        title={"Chance Of Rain"}
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
                                        title={"Humidity"}
                                        value={weatherInfo.humidity}
                                        unit={"%"}
                                        image={Humidity}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={3}>
                            <h5>{translate("hourly_forecast", language)}</h5>
                            <WeatherHourlyList
                                weatherDataHourly={weatherDataHourly}
                                activeHourlyIndex={activeHourlyIndex}
                                handleActiveHourlyIndex={handleActiveHourlyIndex}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default App;