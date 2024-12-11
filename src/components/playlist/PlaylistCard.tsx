import { useState } from "react";
import { motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdOutlinePlaylistPlay } from "react-icons/md";

import { PlaylistType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { elapsedTime } from "../../utils/functions";

const PlaylistCard = ({ playlist }: { playlist: PlaylistType }) => {
  //skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  //navigate method for navigating to playlistOverview route
  const navigate = useNavigate();

  //creating date value from ISO 8601 format
  const myDate = new Date(playlist?.snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.getTime();

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
        className="z-0 p-1 transition-all cursor-pointer rounded-xl group max-w-96 active:bg-zinc-600/70"
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
                <div className="text-lg font-medium text-ellipsis line-clamp-1">
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

            <div className="flex items-center gap-1 text-xs tracking-wide text-zinc-300">
              {!playlist?.status?.privacyStatus ? (
                <Skeleton width={100} className="rounded-2xl" />
              ) : (
                `${
                  playlist?.status?.privacyStatus.slice(0, 1).toUpperCase() +
                  playlist?.status?.privacyStatus.slice(1)
                } • Playlist`
              )}
            </div>
            {isImgLoaded ? (
              <div className="text-xs tracking-wide text-zinc-300">
                {elapsedTime(result)} ago
              </div>
            ) : (
              <Skeleton
                width={150}
                height={10}
                className="rounded-2xl -top-1"
              />
            )}
            {isImgLoaded ? (
              <div
                onClick={() => navigate(`/playlist/${playlist?.id}`)}
                className="text-sm font-medium tracking-wide transition-colors text-zinc-300 hover:text-zinc-100 focus:text-zinc-100 "
              >
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
