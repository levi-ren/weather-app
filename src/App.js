import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import countries from "./helpers/country-codes.json";
import { icons } from "./helpers/icons";
import { WiNa } from "react-icons/wi";

const BASE_API = "https://inuendo.herokuapp.com/api/v1/weather/";

function App() {
  const [query, setQuery] = useState("");
  const [weatherForecast, setWeatherForecast] = useState("");
  const [currentWeather, setCurrentWeather] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [time, setTime] = useState("");

  const [weather, setweather] = useState("");

  useEffect(() => {
    setWeatherLoading(true);
    fetch(`${BASE_API}new york`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setTimeout(() => {}, 1000);
        const { current, daily } = result;
        setCurrentWeather(current);
        daily.splice(4, 3);
        setWeatherForecast(daily);
        setweather(result);
        setWeatherLoading(false);
      });
  }, []);

  const search = (evt) => {
    if (evt.key === "Enter") {
      setWeatherLoading(true);
      fetch(`${BASE_API}${query}`)
        .then((res) => res.json())
        .then((result) => {
          setQuery("");
          console.log(result);
          const { current, daily } = result;
          setCurrentWeather(current);
          daily.splice(4, 3);
          setWeatherForecast(daily);
          setweather(result);
          setWeatherLoading(false);
        });
    }
  };

  const timeBuilder = useCallback(() => {
    const date = new Date().toLocaleString("en-US", {
      timeZone: weather.timezone,
    });
    const newDate = new Date(date);
    return {
      hrs:
        newDate.getHours() > 12 ? newDate.getHours() - 12 : newDate.getHours(),
      min: newDate.getMinutes(),
      sec: newDate.getSeconds(),
      ampm: newDate.getHours() > 12 ? "PM" : "AM",
    };
  }, [weather.timezone]);

  useEffect(() => {
    setTime(timeBuilder);
  }, [timeBuilder]);

  const dateBuilder = (d, abrv = false) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    return !abrv
      ? `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
      : `${d.getDate()} ${days[d.getDay()]} `;
  };

  useEffect(() => {
    const timeout = setInterval(() => setTime(timeBuilder), 1000);
    return () => clearInterval(timeout);
  }, [weather, timeBuilder]);

  const getCountry = (code) => {
    if (countries.hasOwnProperty(code)) {
      return countries[code];
    } else {
      return code;
    }
  };

  const getIcon = (id, ampm) => {
    if (icons.hasOwnProperty(id)) {
      return icons[id][ampm];
    } else {
      return <WiNa />;
    }
  };

  return (
    <div className={`app ${time.ampm === "PM" ? "warm" : ""}`}>
      <main>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter a city name..."
            className="search-bar"
            value={query}
            onChange={(evt) => setQuery(evt.target.value)}
            onKeyPress={search}
          ></input>
        </div>

        <div className={`details ${weatherLoading ? "loading" : ""}`}>
          {weatherLoading ? (
            <span className="loader"></span>
          ) : (
            <>
              <div className="location">
                {currentWeather &&
                  `${currentWeather.name},
            ${getCountry(currentWeather.sys.country)}`}
              </div>

              <div id="time-icon">
                <div className="time">
                  {`${time.hrs}:${time.min}:${time.sec} `}
                  <span>{time.ampm}</span>
                </div>
                {currentWeather && (
                  <img
                    alt="icon"
                    className="icon"
                    src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`}
                  />
                )}
              </div>

              <div id="date-temp">
                {/* FIX THIS!!! */}
                <div className="date">{dateBuilder(new Date())}</div>
                {/* FIX THIS!!! */}
                <div className="temp">
                  {currentWeather &&
                    `${currentWeather.weather[0].main} ${currentWeather.main.temp}`}
                  &deg;c
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className={`forecasts-container ${weatherLoading ? "loading" : ""}`}
        >
          {weatherLoading ? (
            <span className="loader"></span>
          ) : (
            <>
              {weatherForecast &&
                weatherForecast.map((values, index) => {
                  return (
                    <div key={index} className="forecasts">
                      <div className="forecast-date">
                        {dateBuilder(new Date(values.dt * 1000), true)}
                      </div>
                      <div className="forecast-icon">
                        {getIcon(values.weather[0].id, time.ampm)}
                      </div>
                      <div className="forecast-details">
                        <span id="temp">{values.temp.max}&deg;c</span>
                        <span id="desc">{values.weather[0].description}</span>
                      </div>
                      <div className="forecast-infos"></div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
