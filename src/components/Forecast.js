import React, { useEffect, useState } from "react";

const Forecast = ({
  dt,
  meridiem,
  temp,
  weather,
  dateBuilder,
  iconBuilder,
}) => {
  const [date, setDate] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    setDate(dateBuilder(new Date(dt * 1000), true));
  }, [dateBuilder, dt]);

  useEffect(() => {
    setIcon(iconBuilder(weather[0].id, meridiem));
  }, [iconBuilder, weather, meridiem]);

  return (
    <div className="forecasts">
      <div className="forecast-date">{date}</div>
      <div className="forecast-icon">{icon}</div>
      <div className="forecast-details">
        <span id="temp">{temp.max}&deg;c</span>
        <span id="desc">{weather[0].description}</span>
      </div>
      <div className="forecast-infos"></div>
    </div>
  );
};

export default Forecast;
