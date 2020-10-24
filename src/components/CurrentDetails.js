import React, { useEffect, useState } from "react";
import { WiSunrise, WiSunset, WiThermometer } from "react-icons/wi";

const CurrentDetails = ({ toggle, temp, sun }) => {
  const [sunTime, setSunTime] = useState("");

  useEffect(() => {
    const { sunrise, sunset } = sun;
    const s1 = new Date(sunrise * 1000);
    const s2 = new Date(sunset * 1000);
    const value = {
      sunrise: `${
        s1.getHours() > 12 ? s1.getHours() - 12 : s1.getHours()
      }:${s1.getMinutes()}`,
      sunset: `${
        s2.getHours() > 12 ? s2.getHours() - 12 : s2.getHours()
      }:${s2.getMinutes()}`,
    };
    setSunTime(value);
  }, [sun]);

  return (
    <div className={`detail-contents ${!toggle ? "inactive" : ""}`}>
      <div>
        <div>
          <WiSunrise />
          <span>{sunTime.sunrise} am</span>
        </div>
        <div>
          <WiThermometer />
          <span>
            {temp}
            &deg;c
          </span>
        </div>
        <div>
          <WiSunset />
          <span>{sunTime.sunset} pm</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentDetails;
