import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { icons } from "./helpers/icons";
import { WiNa } from "react-icons/wi";
import Current from "./components/Current";
import Forecast from "./components/Forecast";

const BASE_API = "https://inuendo.herokuapp.com/api/v1/weather/";

function App() {
  const [query, setQuery] = useState("");
  const [weatherForecast, setWeatherForecast] = useState("");
  const [currentWeather, setCurrentWeather] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [time, setTime] = useState("");
  const [toggle, setToggle] = useState(false);

  const [weather, setweather] = useState("");

  const getWeather = (city) => {
    setWeatherLoading(true);
    fetch(`${BASE_API}${city ? city : "new york"}`)
      .then((res) => res.json())
      .then((result) => {
        const { current, daily } = result;
        setCurrentWeather(current);
        setWeatherForecast(daily.slice(0, 6));
        setweather(result);
        setQuery("");
        console.log(result);
        setTimeout(() => setWeatherLoading(false), 2000);
      });
  };

  useEffect(getWeather, []);

  const search = (evt) => {
    if (evt.key === "Enter") {
      getWeather(query);
    }
  };

  const timeBuilder = useCallback(() => {
    const date = new Date().toLocaleString("en-US", {
      timeZone: weather.timezone,
    });
    const [now, meridiem] = new Date(date).toLocaleTimeString().split(" ");

    setTime({ now, meridiem });
  }, [weather.timezone]);

  useEffect(() => {
    if (weather) {
      const timeout = setInterval(() => timeBuilder(), 1000);
      return () => clearInterval(timeout);
    }
  }, [weather, timeBuilder]);

  const dateBuilder = useCallback((d, abrv = false) => {
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
  }, []);

  const iconBuilder = useCallback((id, ampm) => {
    if (icons.hasOwnProperty(id)) {
      return icons[id][ampm];
    } else {
      return <WiNa />;
    }
  }, []);

  return (
    <div className={`app ${time.meridiem === "PM" ? "pm" : ""}`}>
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

        <div
          className={`details ${weatherLoading ? "loading" : ""}`}
          onClick={() => setToggle(!toggle)}
        >
          {weatherLoading ? (
            <span className="loader"></span>
          ) : (
            <>
              {weather && (
                <Current
                  currentWeather={currentWeather}
                  time={time}
                  dateBuilder={dateBuilder}
                />
              )}
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
              {weather &&
                weatherForecast.map((values, index) => {
                  const { dt, temp, weather } = values;
                  return (
                    <Forecast
                      dt={dt}
                      meridiem={time.meridiem}
                      temp={temp}
                      weather={weather}
                      dateBuilder={dateBuilder}
                      iconBuilder={iconBuilder}
                      key={index}
                    />
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
