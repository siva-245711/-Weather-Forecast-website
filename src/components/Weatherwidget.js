import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weatherwidget.css';

function WeatherWidget() {
  const [city, setCity] = useState('kakinada');
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

  useEffect(() => {
    const lightningElement = document.querySelector('.lightning');
    const thunderSound = document.getElementById('thunder-sound');

    if (weather && weather.weather[0].main.toLowerCase().includes('thunderstorm')) {
      lightningElement.style.opacity = 1;
      playThunderSound();
      setInterval(randomLightning, Math.random() * 5000 + 3000);
    } else {
      lightningElement.style.opacity = 0;
    }

    function playThunderSound() {
      thunderSound.currentTime = 0;
      thunderSound.play();
    }

    function randomLightning() {
      lightningElement.style.opacity = 1;
      setTimeout(() => {
        lightningElement.style.opacity = 0;
      }, 200);
    }
  }, [weather]);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    const cityInput = e.target.elements.cityName.value;
    if (cityInput) {
      setCity(cityInput);
    }
  };

  return (
    <div className="weather-widget-container thunderstorm">
      <div className="lightning"></div>
      <audio id="thunder-sound" src="path-to-your-thunder-sound.mp3" preload="auto"></audio>

      <div className="header">
        <h1>Weather Forecast</h1>
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
          <h2>{weather.name}</h2>
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
