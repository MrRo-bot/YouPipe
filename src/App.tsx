import { Outlet } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="w-screen h-screen overflow-x-hidden font-sometype">
      <Header />
      <div className="flex">
        <div className="min-w-60">
          <Sidebar />
        </div>
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
