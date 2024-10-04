import { Outlet } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="grid grid-flow-row grid-cols-8 tracking-tighter font-sometype">
      <div className="fixed h-[6vh] col-start-1 col-end-9 row-start-1 row-end-2 w-full bg-white">
        <Header />
      </div>
      <div className="fixed top-[6vh] bottom-0 h-[94vh] col-start-1 col-end-2 row-start-2 row-end-3 bg-white hover:overflow-y-scroll hideScrollbar">
        <Sidebar />
      </div>
      <main className="mt-[14vh] col-start-2 col-end-9 row-start-2 row-end-3 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
