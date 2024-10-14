import { Outlet, ScrollRestoration } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <div className="text-slate-200 font-text">
        <div className="w-full">
          <Header />
        </div>
        <main className="relative flex">
          <Sidebar />
          <Outlet />
          <ScrollRestoration />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
