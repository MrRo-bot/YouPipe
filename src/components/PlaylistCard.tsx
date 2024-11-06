import { motion } from "framer-motion";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdOutlinePlaylistPlay } from "react-icons/md";

import { PlaylistType } from "../types/types";

const PlaylistCard = ({ playlist }: { playlist: PlaylistType }) => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      className="z-0 transition-all cursor-pointer rounded-xl group max-w-96"
    >
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div
            style={{
              backgroundColor: "white",
              filter: "brightness(80%)",
            }}
            className="absolute rounded-xl aspect-video w-[90%] h-[90%] -top-[10px] left-1/2 -translate-x-1/2  outline outline-1 outline-zinc-700"
          ></div>
          <div
            style={{
              backgroundColor: "white",
              filter: "brightness(70%)",
            }}
            className="absolute rounded-xl aspect-video w-[95%] h-[95%] -top-[5px] left-1/2 -translate-x-1/2 outline outline-1 outline-zinc-700"
          ></div>
          <div className="relative object-fill overflow-hidden aspect-video bg-zinc-200 rounded-xl">
            <img
              src={playlist?.snippet?.thumbnails?.maxres?.url}
              alt={playlist?.snippet?.title}
              className="w-full h-full transition group-hover:scale-110 group-focus:scale-110"
            />

            <div className="absolute z-50 p-1 gap-0.5 text-xs text-white rounded-xl bottom-1 right-1 glass-dark flex items-center">
              <MdOutlinePlaylistPlay className="w-4 h-4" />{" "}
              {playlist?.contentDetails?.itemCount} videos
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2">
          <div className="flex justify-between">
            <div className="text-ellipsis line-clamp-1">
              {playlist?.snippet?.title}
            </div>
            <div className="grid ml-auto transition hover:scale-105 focus:scale-105 place-items-center">
              <PiDotsThreeOutlineVerticalFill
                size={1.1 + "em"}
                className="mb-0.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs tracking-wide text-zinc-400">
            {playlist?.status?.privacyStatus} • Playlist
          </div>
          <div className="text-xs tracking-wide text-zinc-400">
            Updated Today
          </div>
          <div className="text-xs tracking-wide text-zinc-400">
            View full playlist
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
