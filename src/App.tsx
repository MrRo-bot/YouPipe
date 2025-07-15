import "./App.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getLocationData } from "../src/features/locationSlice";

import { useNavigatorOnLine } from "./hooks/useNavigatorOnline";
import useCurrentLocation from "../src/hooks/useCurrentLocation";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { useAppDispatch } from "./app/store";

function App() {
  const firstUpdate = useRef(true);

  const isOnline = useNavigatorOnLine();

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    toast(isOnline ? "We're back Online 🛜✔️" : "Offline 🛜❌", {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      className: "!toastGradient !font-bold !text-zinc-50",
      transition: Bounce,
    });
  }, [isOnline]);
  const dispatch = useAppDispatch();
  const locationCoords = useCurrentLocation();

  useEffect(() => {
    (async () => {
      try {
        if (locationCoords.latitude > 0 && locationCoords.longitude > 0) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${locationCoords.latitude}&lon=${locationCoords.longitude}&format=json`
          );
          const coordsDetails = await res.json();
          dispatch(getLocationData(coordsDetails));
          return coordsDetails;
        }
      } catch (error) {
        //react toastify for location fetch errors
        toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!toastGradientError !font-bold !text-zinc-50",
          transition: Bounce,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationCoords]);

  return (
    <>
      <div className="relative h-screen p-1 text-slate-200 font-text">
        <div className="w-full">
          <Header />
        </div>
        <main className="relative flex min-h-[93vh]">
          <Sidebar />
          <Outlet />
          <ScrollRestoration />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </>
  );
}

export default App;
