import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Provider } from "react-redux";

import App from "./App.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Home from "./routes/Home.tsx";
import Playlist from "./routes/Playlist.tsx";
import LikedVideos from "./routes/LikedVideos.tsx";
import ChannelOverview from "./routes/ChannelOverview.tsx";
import Subscription from "./routes/Subscription.tsx";

import { store } from "./app/store.ts";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="subscriptions" element={<Subscription />} />
      <Route path="playlists" element={<Playlist />} />
      <Route path="likedvideos" element={<LikedVideos />} />
      <Route path="channeloverview" element={<ChannelOverview />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
