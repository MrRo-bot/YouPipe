import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Home from "./routes/Home.tsx";
import Subscription from "./routes/Subscription.tsx";
import Channels from "./routes/Channels.tsx";
import Playlist from "./routes/Playlist.tsx";
import History from "./routes/History.tsx";
import WatchLater from "./routes/WatchLater.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="subscriptions" element={<Subscription />} />
      <Route path="channels" element={<Channels />} />
      <Route path="playlists" element={<Playlist />} />
      <Route path="history" element={<History />} />
      <Route path="wl" element={<WatchLater />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
