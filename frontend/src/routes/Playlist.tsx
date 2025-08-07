import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FidgetSpinner } from "react-loader-spinner";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addPlaylists } from "../features/playlistsSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

import customToastFunction from "../utils/Toastify";

import PlaylistCard from "../components/playlist/PlaylistCard";

import { TokensType } from "../types/types";

const Playlist = () => {
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const dispatch = useAppDispatch();
  const playlistData = useAppSelector((state) => state.playlist);
  const isOpen = useAppSelector((state) => state.hamburger);

  const parts = [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "status",
  ];

  //(Don't know why I can't get any saved playlist in this as well)
  const { data, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?mine=true&part=${parts.join(
            ","
          )}&maxResults=50`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (!res.ok && res.status >= 400)
          throw new Error(`Error ${res.status} in fetching user playlists`);

        const playlist = await res.json();
        dispatch(addPlaylists(playlist));
        return playlist;
      } catch (error) {
        customToastFunction(
          `❌ ${error instanceof Error ? error.message : error}`,
          "error"
        );
      }
    },
    enabled: !!token?.access_token,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  console.log(
    (data && data?.pageInfo?.totalResults === 0) ||
      (playlistData && playlistData?.pageInfo?.totalResults === 0),
    data?.pageInfo?.totalResults,
    playlistData?.pageInfo?.totalResults
  );
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`relative mx-1 md:ml-4 md:mr-2 mt-3 mb-2 max-h-[90vh] rounded-xl ${
        !isOpen ? "w-[85vw]" : "w-full"
      } overflow-y-auto hideScrollbar`}
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
        className="m-1 text-2xl font-bold tracking-tight md:m-2 md:text-3xl xl:text-4xl xl:m-4 text-slate-200"
      >
        My Custom Playlists
      </motion.h1>

      <div className="grid grid-flow-row mt-2 md:mt-5 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6 xl:gap-x-6 xl:gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {!token?.access_token ? (
          <div className="col-start-1 px-6 py-3 mx-auto text-center transition-colors lg:px-10 xl:px-14 2xl:px-20 -col-end-1 w-max glass hover:bg-indigo-600/20 focus:bg-indigo-600/20">
            <i className="block text-xs md:text-sm xl:text-base">
              Login to fetch your playlists
            </i>
          </div>
        ) : (data && data?.pageInfo?.totalResults === 0) ||
          (playlistData && playlistData?.pageInfo?.totalResults === 0) ? (
          <div className="mx-auto text-2xl italic font-bold w-max">
            Not Found
          </div>
        ) : isLoading ? (
          <FidgetSpinner
            visible={true}
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper size-16 md:size-20 col-start-1 text-center mx-auto -col-end-1 translate-y-1/2 -top-1/2"
          />
        ) : (
          playlistData?.items?.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Playlist;
