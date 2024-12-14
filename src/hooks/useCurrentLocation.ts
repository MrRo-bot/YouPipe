//custom hook for getting location coordinates
import { useEffect, useState } from "react";

const useCurrentLocation = () => {
  //state object for storing location coordinates
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  //for setting position coordinates in state
  const getPos = (position: {
    coords: { longitude: number; latitude: number };
  }) => {
    setLocation((prev) => ({
      ...prev,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    }));
  };

  //error function for API error
  const posFail = (err: { code: number; message: string }) => {
    console.error(`Unable to fetch location ERROR:${err.code}=${err.message}`);
  };

  //effect for fetching location data using GeolocationAPI
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(getPos, posFail, {
        enableHighAccuracy: true,
      });
    } else {
      console.error("Browser doesn't support Geolocation API");
    }
  }, []);

  return location;
};

export default useCurrentLocation;
