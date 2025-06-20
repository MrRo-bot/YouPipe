import "./App.css";
import { useLayoutEffect, useRef } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useNavigatorOnLine } from "./hooks/useNavigatorOnline";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

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
