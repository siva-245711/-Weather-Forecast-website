import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weatherwidget.css';

function WeatherWidget() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);          
      setError(null);
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        setWeather(response.data);
      } catch (err) {
        console.error('Error fetching weather data:', err.response || err.message);
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    const cityInput = e.target.elements.cityName.value;
    if (cityInput) {
      setCity(cityInput);
    }
  };

  return (
    <div className="weather-widget-container">
      <div className="container">
        <div className="title">
          <h1>Weather Forecast</h1>

        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleCitySubmit} className="form">
          <input
            type="text"
            name="cityName"
            placeholder="Enter city"
            className="search-bar"
          />
          <button type="submit" className="submit-button">
            Get Weather
          </button>
        </form>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {weather && (
        <div className="weather-info">
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <img
            src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt="Weather icon"
          />
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
