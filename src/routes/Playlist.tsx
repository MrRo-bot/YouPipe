import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FidgetSpinner } from "react-loader-spinner";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addPlaylists } from "../features/playlistsSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

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
  useQuery({
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
        if (!res.ok) throw new Error("Error in fetching user playlists");

        const playlist = await res.json();
        dispatch(addPlaylists(playlist));
        return playlist;
      } catch (error) {
        toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!toastGradientError !font-bold !text-zinc-50",
          transition: Bounce,
        });
      }
    },
  });

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`relative mb-2 mt-3 max-h-[90vh] rounded-xl mx-4 ${
        !isOpen ? "w-[85vw]" : "w-full"
      } overflow-y-auto hideScrollbar`}
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
        className="px-2.5 text-xl font-bold tracking-tight md:px-2 md:text-2xl xl:text-4xl text-slate-200"
      >
        My Custom Playlists
      </motion.h1>

      <div className="grid grid-flow-row p-2 mt-5 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6 xl:gap-x-6 xl:gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {playlistData?.items?.length <= 1 ? (
          <FidgetSpinner
            visible={true}
            height="80"
            width="80"
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper col-start-1 mx-auto -col-end-1"
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
