import { useEffect, useState } from "react";

import customToastFunction from "../utils/Toastify";

const useCurrentLocation = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const getPos = (position: {
    coords: { longitude: number; latitude: number };
  }) => {
    setLocation((prev) => ({
      ...prev,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    }));
  };

  const posFail = (err: { code: number; message: string }) => {
    console.error(`Unable to fetch location ERROR:${err.code}=${err.message}`);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(getPos, posFail, {
        enableHighAccuracy: true,
      });
    } else {
      customToastFunction(`Geolocation API not supported`, "error");
    }
  }, []);

  return location;
};

export default useCurrentLocation;
