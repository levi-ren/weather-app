import React, { useEffect, useState } from "react";
import countries from "../helpers/country-codes.json";
import CurrentDetails from "./CurrentDetails";

const Current = ({ currentWeather, time, dateBuilder }) => {
  const { name, main, sys, weather } = currentWeather;
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setDate(dateBuilder(new Date()));
  }, [dateBuilder]);

  const getCountry = (code) => {
    if (countries.hasOwnProperty(code)) {
      return countries[code];
    } else {
      return code;
    }
  };

  useEffect(() => {
    setCountry(getCountry(sys.country));
  }, [sys.country]);

  return (
    <div onClick={() => setToggle(!toggle)}>
      <div className="location">
        {name}, {country}
      </div>

      <div id="time-icon">
        <div className="time">
          {time.now} <span>{time.meridiem}</span>
        </div>
        <img
          alt="icon"
          className="icon"
          src={`http://openweathermap.org/img/wn/${weather[0].icon}.png`}
        />
      </div>

      <div id="date-temp">
        <div className="date">{date}</div>
        <div className="temp">
          {`${weather[0].main} ${main.temp}`}
          &deg;c
        </div>
      </div>

      <CurrentDetails toggle={toggle} temp={main.temp} sun={sys} />
    </div>
  );
};

export default Current;
