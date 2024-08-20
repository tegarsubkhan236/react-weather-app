import './App.css';
import {Col, Container, Row, Spinner} from "react-bootstrap";
import Header from "./components/header/Header.jsx";
import WeatherDailyList from "./components/weatherDailyList/WeatherDailyList.jsx";
import WeatherHourlyList from "./components/weatherHourlyList/WeatherHourlyList.jsx";
import WeatherOverview from "./components/weatherOverwiew/WeatherOverview.jsx";
import {useLanguage} from "./context/LanguageContext.jsx";
import {useTheme} from "./context/ThemeContext.jsx";
import {useWeatherData} from "./hook/useWeatherData.js";
import {useSearchWeatherData} from "./hook/useSearchWeatherData.js";
import WindStatus from "./assets/wind_status.png";
import Humidity from "./assets/humidity.png";
import Visibility from "./assets/visibility.png";
import UV from "./assets/uv.png";

function App() {
    const {translate} = useLanguage();
    const {theme} = useTheme();

    const initialQuery = "Purwokerto";
    const {
        locationData,
        weatherDataDaily,
        weatherDataHourly,
        weatherInfo,
        loading,
        error,
        fetchLocationData,
        handleActiveIndex,
        handleActiveHourlyIndex,
        activeIndex,
        activeHourlyIndex
    } = useWeatherData(initialQuery);
    const {
        searchQuery,
        setSearchQuery,
        handleSearchSubmit
    } = useSearchWeatherData(fetchLocationData);

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
                            {...item}
                        />
                    ))}
                </Col>

                <Col md={12} style={{height: '63vh'}}>
                    <Row className="gx-4 pt-3 pb-3">
                        <Col md={9}>
                            <h5>{translate("weather_overview")}</h5>
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
                                        title={weatherInfo.rain != null ? translate("chance_of_rain") : translate("no_chance_of_rain")}
                                        value={weatherInfo.rain != null ? weatherInfo.rain : 0}
                                        unit={"mm"}
                                        image={UV}
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
                                <Col md={6}>
                                    <WeatherOverview
                                        title={"Visibility"}
                                        value={weatherInfo.humidity}
                                        unit={"%"}
                                        image={Visibility}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={3}>
                            <h5>{translate("hourly_forecast")}</h5>
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