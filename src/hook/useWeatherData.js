import { useState, useEffect, useCallback } from 'react';
import { FormatTime, KelvinToCelsius, MpsToKmph } from "../helper/converter.js";
import {useLanguage} from "../context/LanguageContext.jsx";
import axios from 'axios';

export const useWeatherData = (initialQuery) => {
    const { language, getDaysOfWeek } = useLanguage();

    const [locationData, setLocationData] = useState({});
    const [weatherData, setWeatherData] = useState([]);
    const [weatherDataDaily, setWeatherDataDaily] = useState([]);
    const [weatherDataHourly, setWeatherDataHourly] = useState([]);
    const [weatherInfo, setWeatherInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeHourlyIndex, setActiveHourlyIndex] = useState(0);

    const fetchLocationData = useCallback(async (query) => {
        try {
            const locationResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=80b22f1cf25c49a05e196ec97eedc3aa`);
            const { lat, lon, name, state, country } = locationResponse.data[0];
            setLocationData({ cityName: name, stateName: state, countryName: country });

            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=80b22f1cf25c49a05e196ec97eedc3aa&lang=${language}`);
            const { sunrise, sunset } = weatherResponse.data.city;
            const daysOfWeekMap = getDaysOfWeek();

            const allWeatherData = weatherResponse.data.list.map(item => {
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
                    visibility: item.visibility,
                    pop: item.pop,
                    rain: item.rain ? item.rain['3h'] : null,
                    weather_icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    weather_icon_desc: item.weather[0].description,
                    weather_sunrise: FormatTime(sunrise, language),
                    weather_sunset: FormatTime(sunset, language),
                };
            });

            console.log(allWeatherData)
            setWeatherData(allWeatherData);

            const sameTimeData = allWeatherData.filter((item, index, arr) => arr.findIndex(data => data.weather_day === item.weather_day) === index);
            setWeatherDataDaily(sameTimeData);

            const initialWeatherInfo = sameTimeData[0];
            setWeatherInfo(initialWeatherInfo);

            const hourlyData = allWeatherData.filter(item => item.weather_day === initialWeatherInfo.weather_day);
            setWeatherDataHourly(hourlyData);

            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchLocationData(initialQuery);
    }, [initialQuery, fetchLocationData]);

    const handleActiveIndex = (index) => {
        setActiveIndex(index);
        setActiveHourlyIndex(0);

        const selectedDay = weatherDataDaily[index];
        setWeatherInfo(selectedDay);

        const hourlyData = weatherData.filter(item => item.weather_day === selectedDay.weather_day);
        setWeatherDataHourly(hourlyData);
    };

    const handleActiveHourlyIndex = (index) => {
        setActiveHourlyIndex(index);

        const selectedDay = weatherDataHourly[index];
        setWeatherInfo(selectedDay);
    };

    return {
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
    };
};