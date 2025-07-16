import "./App.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, ScrollRestoration } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getLocationData } from "../src/features/locationSlice";

import { useNavigatorOnLine } from "./hooks/useNavigatorOnline";
import useCurrentLocation from "../src/hooks/useCurrentLocation";
import customToastFunction from "./utils/Toastify";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { useAppDispatch, useAppSelector } from "./app/store";

function App() {
  const firstUpdate = useRef(true);

  const isOnline = useNavigatorOnLine();

  const profileData = useAppSelector((state) => state.profile);
  const tokenData = useAppSelector((state) => state.token);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    customToastFunction(isOnline ? "We're back Online 🛜✔️" : "Offline 🛜❌");
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
        customToastFunction(
          `❌ ${error instanceof Error ? error.message : error}`,
          "error"
        );
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
          {profileData?.email && tokenData?.access_token && <Sidebar />}
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
