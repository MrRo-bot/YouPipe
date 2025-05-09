import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./App.css";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

function App() {
  return (
    <>
      <div className="relative text-slate-200 font-text">
        <div className="w-full">
          <Header />
        </div>
        <main className="relative flex min-h-[90vh]">
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
