//custom hook for getting location coordinates

import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error(`Geolocation API not supported`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, []);

  return location;
};

export default useCurrentLocation;
