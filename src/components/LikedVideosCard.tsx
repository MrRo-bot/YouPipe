import { motion } from "framer-motion";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import { LikedVideosType } from "../types/types";
import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../utils/functions";

const WatchLaterCard = ({
  likedvideo,
  index,
}: {
  likedvideo: LikedVideosType;
  index: number;
}) => {
  const myDate = new Date(likedvideo?.snippet?.publishedAt || "");
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
        className="flex items-center justify-between gap-1 p-2 transition-all cursor-pointer hover:bg-zinc-800/70 rounded-2xl"
      >
        <div className="flex">
          <div className="self-center mr-1 text-center">{index + 1}</div>
          <div className="relative overflow-hidden w-52 aspect-video rounded-2xl">
            {likedvideo?.snippet?.thumbnails?.high?.url ? (
              <img
                className="object-cover w-full h-full"
                src={likedvideo?.snippet?.thumbnails?.high?.url}
                alt={likedvideo?.snippet?.title[0]}
              />
            ) : (
              <Skeleton className="h-full -top-1 rounded-2xl" />
            )}
            <div className="absolute z-40 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
              {videoDuration(likedvideo?.contentDetails?.duration || "")}
            </div>
          </div>
          <div className="flex flex-col ml-3 flex-start">
            <div className="relative flex items-start justify-between gap-1">
              <h3 className="w-full text-lg text-ellipsis line-clamp-1">
                {likedvideo?.snippet?.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              {`${likedvideo?.snippet?.channelTitle} • ${rawViewsToString(
                likedvideo?.statistics?.viewCount || ""
              )} views • ${elapsedTime(result)} ago`}
            </div>
          </div>
        </div>

        <PiDotsThreeOutlineVerticalFill className="cursor-pointer w-7 h-7 text-zinc-200" />
      </motion.div>
    </SkeletonTheme>
  );
};

export default WatchLaterCard;
