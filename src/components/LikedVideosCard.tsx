import { useState } from "react";
import { motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import { LikedVideosType } from "../types/types";
import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../utils/functions";

const LikedVideosCard = ({
  likedvideo,
  index,
}: {
  likedvideo: LikedVideosType;
  index: number;
}) => {
  //creating date value from ISO 8601 format
  const myDate = new Date(likedvideo?.snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  //for skeleton loading before image is loaded
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
        className="flex items-center justify-between gap-1 p-2 transition-all cursor-pointer hover:bg-zinc-800/70 rounded-2xl"
      >
        <div className="flex">
          <div className="self-center mr-1 text-center">{index + 1}</div>
          <div className="relative overflow-hidden w-52 aspect-video rounded-2xl">
            {!likedvideo?.snippet?.thumbnails?.high?.url ? (
              <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
            ) : (
              <>
                <img
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
                  className="object-cover w-full h-full"
                  src={likedvideo?.snippet?.thumbnails?.high?.url}
                  alt=""
                />
                <div className="absolute z-40 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                  {videoDuration(
                    likedvideo?.contentDetails?.duration || "0:00"
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col ml-3 flex-start">
            <div className="relative flex items-start justify-between gap-1">
              {isImgLoaded ? (
                <h3 className="w-full text-lg text-ellipsis line-clamp-1">
                  {likedvideo?.snippet?.title || ""}
                </h3>
              ) : (
                <Skeleton
                  width={300}
                  height={27}
                  className="top-2 rounded-2xl"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              {isImgLoaded ? (
                `${
                  likedvideo?.snippet?.channelTitle || ""
                } • ${rawViewsToString(
                  likedvideo?.statistics?.viewCount || ""
                )} views • ${elapsedTime(result) || ""} ago`
              ) : (
                <Skeleton
                  width={150}
                  height={20}
                  className="top-5 rounded-2xl"
                />
              )}
            </div>
          </div>
        </div>

        <PiDotsThreeOutlineVerticalFill className="cursor-pointer w-7 h-7 text-zinc-200" />
      </motion.div>
    </SkeletonTheme>
  );
};

export default LikedVideosCard;
