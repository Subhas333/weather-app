import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import images from '../assets'

const Weather = () => {

    const inputRef = useRef();

    const [weatherData, setWeatherData] = useState(null);
    const allIcons = {
        "01d": images.clear,
        "01n": images.clear,
        "02d": images.cloud,
        "02n": images.cloud,
        "03d": images.cloud,
        "03n": images.cloud,
        "04d": images.drizzle,
        "04n": images.drizzle,
        "09d": images.rain,
        "09n": images.rain,
        "10d": images.rain,
        "10n": images.rain,
        "13d": images.snow,
        "13n": images.snow,
    }

    const APIKEY = import.meta.env.VITE_APP_ID;

    const search = async (city) => {
        if (city === "") {
            alert("Enter the city name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`;
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            if(!res.ok){
                alert(data.message);
                return;
            }
            const icon = allIcons[data.weather[0].icon] || images.clear;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    useEffect(() => {
        search("London");
    },[]);

    return (
        <div className='weather'>
            <div className="searchBar">
                <input ref={inputRef} type="text" placeholder='Search' onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        search(inputRef.current.value); } 
                        }}
                />
                <img src={images.search} alt='search' onClick={() => search(inputRef.current.value)} />
            </div>

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt='weather icon' className='weatherIcon' />
                    <p className='temperature'>{weatherData.temperature}&#176;c</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weatherData">
                        <div className="col">
                            <img src={images.humidity} alt="humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={images.wind} alt="wind" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : <p>Loading weather data...</p>}
        </div>
    )
}

export default Weather;
