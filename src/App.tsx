import { Outlet } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="grid grid-flow-row grid-cols-8 tracking-tighter font-sometype">
      <div className="fixed z-50 w-full col-start-1 col-end-9 row-start-1 row-end-2 bg-white">
        <Header />
      </div>
      <div className="fixed top-[7vh] bottom-0 h-[94vh] col-start-1 col-end-2 row-start-2 row-end-3 bg-white overflow-y-scroll hideScrollbar z-50">
        <Sidebar />
      </div>
      <main className="col-start-2 col-end-9 row-start-2 row-end-3 p-2">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
