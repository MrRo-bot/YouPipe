import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
      <aside></aside>
    </>
  );
}

export default App;
