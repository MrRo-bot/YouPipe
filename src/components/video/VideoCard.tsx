import { useState } from "react";
import { motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import {
  PiClosedCaptioningFill,
  PiDotsThreeOutlineVerticalFill,
  PiHighDefinitionFill,
} from "react-icons/pi";
import { FcClock, FcStart } from "react-icons/fc";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";
import { ChannelInfoType, VideosListType } from "../../types/types";
import { useNavigate } from "react-router-dom";

const VideoCard = ({
  video,
  channel,
}: {
  video: VideosListType;
  channel: ChannelInfoType;
}) => {
  //skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  //creating date value from ISO 8601 format
  const myDate = new Date(video?.items[0]?.snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  const navigate = useNavigate();

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
        onClick={() => navigate(`/video/${video?.items[0]?.id}`)}
        className={`z-0 flex flex-col justify-between h-full gap-1 p-2 transition-all cursor-pointer group max-w-96 active:bg-zinc-600/70 glass rounded-2xl`}
      >
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden aspect-video rounded-2xl">
            {
              <>
                <img
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
                  src={video?.items[0]?.snippet?.thumbnails?.high?.url || ""}
                  alt=""
                  className="object-cover w-full h-full transition rounded-2xl group-hover:scale-110 group-focus:scale-110"
                />
                {video?.items[0]?.contentDetails?.caption === "true" && (
                  <div className="absolute z-50 text-xs px-0.5 text-white rounded-none bottom-1 left-1 glass-dark">
                    <PiClosedCaptioningFill className="w-5 h-5" />
                  </div>
                )}
                <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                  {videoDuration(
                    video?.items[0]?.contentDetails?.duration || ""
                  ) || ""}
                </div>
              </>
            }
            {!isImgLoaded && (
              <Skeleton
                width={"100%"}
                height={"100%"}
                className="-top-1 rounded-2xl"
              />
            )}
          </div>
          <div className="flex flex-col gap-3 px-1">
            <div className="flex justify-between">
              <div className="flex items-center">
                <FcStart className="w-5 h-5" />
                {isImgLoaded ? (
                  <div className="text-xs tracking-wide text-zinc-400">
                    {rawViewsToString(
                      video?.items[0]?.statistics?.viewCount || ""
                    )}{" "}
                    views
                  </div>
                ) : (
                  <Skeleton width={100} className="rounded-2xl" />
                )}
              </div>
              <div className="flex items-center">
                {isImgLoaded ? (
                  <div className="text-xs tracking-wide text-zinc-400">
                    {video?.items[0]?.contentDetails?.definition === "hd" ? (
                      <PiHighDefinitionFill className="w-5 h-5" />
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <Skeleton width={20} className="rounded-2xl" />
                )}
              </div>
              <div className="flex items-center">
                <FcClock color="black" className="w-5 h-5" />
                {isImgLoaded ? (
                  <div className="text-xs tracking-wide text-zinc-400">
                    {elapsedTime(result)} ago
                  </div>
                ) : (
                  <Skeleton width={100} className="rounded-2xl" />
                )}
              </div>
            </div>
            {isImgLoaded ? (
              <div className="text-ellipsis line-clamp-2">
                {video?.items[0]?.snippet?.title || ""}
              </div>
            ) : (
              <Skeleton width={200} className="rounded-2xl" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-start gap-1">
          <div className="grid w-5 h-5 overflow-hidden rounded-full place-items-center">
            {isImgLoaded && (
              <img
                className="w-full h-full rounded-full"
                src={channel?.items[0]?.snippet?.thumbnails?.default?.url || ""}
                alt=""
              />
            )}

            {!isImgLoaded && (
              <Skeleton width={20} height={20} circle className="-top-1" />
            )}
          </div>
          {isImgLoaded ? (
            <>
              <div className="text-xs tracking-wide text-zinc-300 text-ellipsis">
                {channel?.items[0]?.snippet?.title || ""}
              </div>
              <div className="ml-auto transition hover:scale-105 focus:scale-105">
                <PiDotsThreeOutlineVerticalFill />
              </div>
            </>
          ) : (
            <Skeleton width={100} className="rounded-2xl" />
          )}
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default VideoCard;
