import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { PiClosedCaptioningFill, PiHighDefinitionFill } from "react-icons/pi";
import { FcClock, FcStart } from "react-icons/fc";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";

import { VideoType } from "../../types/types";

const HomeCard = ({ video }: { video: VideoType }) => {
  const navigate = useNavigate();

  const date = new Date(video?.snippet?.publishedAt || "").getTime();

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
        onClick={() => navigate(`/video/${video?.id}`)}
        className={`z-0 flex flex-col justify-between h-full gap-1 p-2 transition-colors cursor-pointer group hover:bg-indigo-600/20 focus:bg-indigo-600/20 glass rounded-2xl`}
      >
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden aspect-video rounded-2xl">
            {video ? (
              <>
                <img
                  referrerPolicy="no-referrer"
                  src={video?.snippet?.thumbnails?.high?.url || ""}
                  alt=""
                  className="object-cover w-full h-full transition-transform rounded-2xl group-hover:scale-110 group-focus:scale-110"
                />
                <div className="absolute z-50 p-1 text-xs text-white md:text-sm rounded-2xl bottom-1 right-1 glass-dark">
                  {videoDuration(video?.contentDetails?.duration || "00:0")}
                </div>
                {video?.snippet?.liveBroadcastContent !== "none" && (
                  <div className="absolute z-50 p-1 text-xs text-white md:text-sm rounded-2xl bottom-1 left-1 glass-dark">
                    {video?.snippet?.liveBroadcastContent === "live" ? (
                      <span className="bg-red-600 text-zinc-100 text-xs md:text-sm px-1 py-0.5 rounded-2xl">
                        LIVE
                      </span>
                    ) : (
                      <span className="bg-zinc-600/30 text-zinc-100 text-xs md:text-sm px-1 py-0.5 rounded-2xl">
                        UPCOMING
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Skeleton
                width={"100%"}
                height={"100%"}
                className="-top-1 rounded-2xl"
              />
            )}
          </div>
          <div className="flex flex-col gap-3 px-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <FcStart className="size-4 md:size-6" />
                {video ? (
                  <div className="text-xs tracking-wide sm:text-sm md:text-base text-zinc-400">
                    {rawViewsToString(video?.statistics?.viewCount || "")} views
                  </div>
                ) : (
                  <Skeleton width={100} className="rounded-2xl" />
                )}
              </div>
              <div className="flex items-center justify-center gap-1 md:gap-3">
                {video ? (
                  <>
                    <div className="text-xs tracking-wide sm:text-sm md:text-base text-zinc-400">
                      {video?.contentDetails?.definition === "hd" ? (
                        <PiHighDefinitionFill className="size-4 md:size-6" />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="text-xs tracking-wide sm:text-sm md:text-base text-zinc-400">
                      {video?.contentDetails?.caption === "true" && (
                        <PiClosedCaptioningFill className="size-4 md:size-6" />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Skeleton width={20} className="rounded-2xl" />
                    <Skeleton width={20} className="rounded-2xl" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <FcClock color="black" className="size-4 md:size-6" />
                {video ? (
                  <div className="text-xs tracking-wide sm:text-sm md:text-base text-zinc-400">
                    {elapsedTime(date)} ago
                  </div>
                ) : (
                  <Skeleton width={70} className="rounded-2xl" />
                )}
              </div>
            </div>
            {video ? (
              <div className="font-bold transition-colors md:tracking-wide md:text-lg md:font-semibold text-ellipsis line-clamp-2 text-zinc-50 hover:text-zinc-400 focus:text-zinc-400 active:text-zinc-400">
                {video?.snippet?.localized?.title || ""}
              </div>
            ) : (
              <Skeleton width={200} height={18} className="rounded-2xl" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-start gap-1">
          {video ? (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/channel/${video?.snippet?.channelId}`);
                }}
                className="text-xs tracking-wide sm:text-sm md:text-base md:tracking-tight hover:shadow-[0_0_1px_1px_rgb(245_127_56)] focus:shadow-[0_0_1px_1px_rgb(245_127_56)]  px-1 py-0.5 transition-colors rounded-2xl fold-semibold bg-zinc-50/80 hover:bg-zinc-800/50 focus:bg-zinc-800/50 w-max text-zinc-900 hover:text-zinc-50 focus:text-zinc-50 text-ellipsis"
              >
                {video?.snippet?.channelTitle || ""}
              </div>
            </>
          ) : (
            <Skeleton width={100} className="!ml-1 rounded-2xl" />
          )}
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default HomeCard;
