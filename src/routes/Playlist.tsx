import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
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
          )}&maxResults=20`,
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
    <AnimatePresence>
      <motion.div
        className={`relative mb-2 mt-3 max-h-[90vh] rounded-xl mx-4 ${
          !isOpen ? "w-[85vw]" : "w-full"
        } overflow-y-auto hideScrollbar`}
      >
        <h1 className="px-2 text-4xl font-bold">My Custom Playlists</h1>

        <div className="grid grid-flow-row p-2 mt-5 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {!playlistData?.items?.length ? (
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
    </AnimatePresence>
  );
};

export default Playlist;
