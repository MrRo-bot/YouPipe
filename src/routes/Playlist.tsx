import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { FidgetSpinner } from "react-loader-spinner";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addPlaylists } from "../features/playlistsSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { TokensType } from "../types/types";
import PlaylistCard from "../components/playlist/PlaylistCard";

const Playlist = () => {
  //token data from localStorage
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //playlist data from redux store
  const playlistData = useAppSelector((state) => state.playlist);

  //sidebar
  const isOpen = useAppSelector((state) => state.hamburger);

  //dispatch for redux reducers
  const dispatch = useAppDispatch();

  //parts for API call
  const parts = [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "status",
  ];

  //query for getting users playlist (Don't know why I can't get any saved playlist in this as well)
  const { status } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
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
      const playlist = await res.json();
      dispatch(addPlaylists(playlist));
      return playlist;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
          {status === "success" &&
            playlistData?.items?.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          {playlistData?.items?.length > 0 || (
            <FidgetSpinner
              visible={true}
              height="80"
              width="80"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper col-start-1 mx-auto -col-end-1"
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Playlist;
