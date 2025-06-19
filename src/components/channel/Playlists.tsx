import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppSelector } from "../../app/store";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import PlaylistCard from "../playlist/PlaylistCard";

import { PlaylistType, TokensType } from "../../types/types";

const Playlists = () => {
  const [playlist, setPlaylist] = useState<PlaylistType[]>([]);

  const channelSections = useAppSelector((state) =>
    state.channelOverview.channelSections.items.filter(
      (channelSection) =>
        channelSection?.contentDetails &&
        channelSection?.contentDetails?.playlists
    )
  );

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const parts = [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "status",
  ];

  useEffect(() => {
    const getAllPlaylistSectionData = async () => {
      channelSections.map(async (x) => {
        try {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlists?id=${
              x.contentDetails.playlists[0]
            }&part=${parts.join(",")}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${token?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Error in fetching channels playlists");
          const playlist = await res.json();
          setPlaylist((prev) => [...prev, playlist]);
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
      });
    };

    getAllPlaylistSectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <motion.div className="relative mb-2 mt-3 max-h-[90vh] rounded-xl mx-4 w-full overflow-y-auto hideScrollbar">
        {playlist.length < 1 ? (
          <div className="mx-auto text-lg italic font-bold w-max">
            No Playlists Found
          </div>
        ) : (
          <div className="grid grid-flow-row p-2 mt-5 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlist?.map((playlist) => (
              <PlaylistCard
                key={playlist?.etag}
                //@ts-expect-error its just PlaylistType
                playlist={playlist?.items[0]}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Playlists;
