import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Provider } from "react-redux";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Home from "./routes/Home.tsx";
import Playlist from "./routes/Playlist.tsx";
import LikedVideos from "./routes/LikedVideos.tsx";
import Subscription from "./routes/Subscription.tsx";
import PlaylistOverview from "./routes/PlaylistOverview.tsx";
import Search from "./routes/Search.tsx";
import Player from "./routes/Player.tsx";

import { store } from "./app/store.ts";

//creating query client
const queryClient = new QueryClient();

//defining routers with browser router and routes form elements
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="subscriptions" element={<Subscription />} />
      <Route path="playlists" element={<Playlist />} />
      <Route path="likedvideos" element={<LikedVideos />} />
      {/* <Route path="channeloverview" element={<ChannelOverview />} /> */}
      <Route path="search" element={<Search />} />
      <Route path="playlist/:playlistId" element={<PlaylistOverview />} />
      <Route path="video/:videoId" element={<Player />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  // google auth library
  <GoogleOAuthProvider clientId={import.meta.env.VITE_YOUPIPE_CLIENT_ID}>
    {/* tanstack query */}
    <QueryClientProvider client={queryClient}>
      {/* react redux */}
      <Provider store={store}>
        {/* react router */}
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
