import { motion } from "framer-motion";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdOutlinePlaylistPlay } from "react-icons/md";

import { PlaylistType } from "../types/types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useState } from "react";

const PlaylistCard = ({ playlist }: { playlist: PlaylistType }) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
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
          <div className="relative object-fill overflow-hidden transition aspect-video rounded-xl">
            {!playlist?.snippet?.thumbnails?.maxres?.url ? (
              <Skeleton
                width={"100%"}
                height={"100%"}
                className="rounded-2xl -top-1"
              />
            ) : (
              <>
                <img
                  loading="lazy"
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
                  className="w-full h-full transition group-hover:scale-110 group-focus:scale-110"
                  src={playlist?.snippet?.thumbnails?.maxres?.url}
                  alt=""
                />
                <div className="absolute z-50 p-1 gap-0.5 text-xs text-white rounded-xl bottom-1 right-1 glass-dark flex items-center">
                  <MdOutlinePlaylistPlay className="w-4 h-4" />{" "}
                  {playlist?.contentDetails?.itemCount} videos
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1 px-2">
            <div className="flex justify-between">
              {!playlist?.snippet?.title ? (
                <Skeleton width={200} height={15} className="rounded-2xl" />
              ) : (
                <div className="text-ellipsis line-clamp-1">
                  {playlist?.snippet?.title}
                </div>
              )}
              <div className="grid ml-auto transition hover:scale-105 focus:scale-105 place-items-center">
                <PiDotsThreeOutlineVerticalFill
                  size={1.1 + "em"}
                  className="mb-0.5"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs tracking-wide text-zinc-400">
              {!playlist?.status?.privacyStatus ? (
                <Skeleton width={100} className="rounded-2xl" />
              ) : (
                `${playlist?.status?.privacyStatus} • Playlist`
              )}
            </div>
            {isImgLoaded ? (
              <div className="text-xs tracking-wide text-zinc-400">
                Updated Today
              </div>
            ) : (
              <Skeleton
                width={150}
                height={10}
                className="rounded-2xl -top-1"
              />
            )}
            {isImgLoaded ? (
              <div className="text-xs tracking-wide text-zinc-400">
                View full playlist
              </div>
            ) : (
              <Skeleton
                width={120}
                height={10}
                className="rounded-2xl -top-3"
              />
            )}
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default PlaylistCard;
