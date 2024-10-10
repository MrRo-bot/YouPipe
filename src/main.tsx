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
import Subscription from "./routes/Subscription.tsx";
import SubscriptionLayout from "./SubscriptionLayout.tsx";
import Channels from "./routes/Channels.tsx";
import Playlist from "./routes/Playlist.tsx";
import History from "./routes/History.tsx";
import WatchLater from "./routes/WatchLater.tsx";
import LikedVideos from "./routes/LikedVideos.tsx";
import ChannelOverview from "./routes/ChannelOverview.tsx";

import store from "./store/store.ts";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="subscriptions" element={<SubscriptionLayout />}>
        <Route index element={<Subscription />} />
        <Route path="channels" element={<Channels />} />
      </Route>
      <Route path="channels" element={<Channels />} />
      <Route path="playlists" element={<Playlist />} />
      <Route path="history" element={<History />} />
      <Route path="watchlater" element={<WatchLater />} />
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
