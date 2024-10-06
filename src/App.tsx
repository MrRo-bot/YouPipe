import { Outlet } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="tracking-tighter text-white font-text">
      <div className="w-full">
        <Header />
      </div>
      <main className="relative flex">
        <Sidebar />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
