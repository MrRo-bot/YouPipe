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
import Playlist from "./routes/Playlist.tsx";
import LikedVideos from "./routes/LikedVideos.tsx";
import Subscription from "./routes/Subscription.tsx";
import PlaylistOverview from "./routes/PlaylistOverview.tsx";
import Search from "./routes/Search.tsx";
import Player from "./routes/Player.tsx";
import ChannelOverview from "./routes/ChannelOverview.tsx";
import UploadsList from "./components/channel/UploadsList.tsx";
import Channels from "./components/channel/Channels.tsx";
import Playlists from "./components/channel/Playlists.tsx";

import { Provider } from "react-redux";
import { store } from "./app/store.ts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="subscriptions" element={<Subscription />} />
      <Route path="playlists" element={<Playlist />} />
      <Route path="likedvideos" element={<LikedVideos />} />
      <Route path="channel/:channelId" element={<ChannelOverview />}>
        <Route index path="" element={<UploadsList />} />
        <Route path="channels" element={<Channels />} />
        <Route path="playlists" element={<Playlists />} />
      </Route>
      <Route path="search" element={<Search />} />
      <Route path="playlist/:playlistId" element={<PlaylistOverview />} />
      <Route path="video/:videoId" element={<Player />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_YOUPIPE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
