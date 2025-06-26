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

import { ChannelInfoType, VideosListType } from "../../types/types";

const VideoCard = ({
  video,
  channel,
}: {
  video: VideosListType;
  channel: ChannelInfoType;
}) => {
  const navigate = useNavigate();

  const date = new Date(video?.items[0]?.snippet?.publishedAt || "").getTime();

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
        className={`z-0 flex flex-col justify-between h-full gap-1 p-2 transition-all cursor-pointer group hover:bg-indigo-600/20 focus:bg-indigo-600/20  glass rounded-2xl`}
      >
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden aspect-video rounded-2xl">
            {!video ? (
              <Skeleton
                width={"100%"}
                height={"100%"}
                className="-top-1 rounded-2xl"
              />
            ) : (
              <>
                <img
                  referrerPolicy="no-referrer"
                  src={video?.items[0]?.snippet?.thumbnails?.high?.url || ""}
                  alt=""
                  className="object-cover w-full h-full transition rounded-2xl group-hover:scale-110 group-focus:scale-110"
                />
                <div className="absolute z-50 p-1 text-sm text-white rounded-2xl bottom-1 right-1 glass-dark">
                  {videoDuration(
                    video?.items[0]?.contentDetails?.duration || "00:0"
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 px-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <FcStart className="w-6 h-6" />
                {!video ? (
                  <Skeleton width={100} className="rounded-2xl" />
                ) : (
                  <div className="text-sm tracking-wide text-zinc-400">
                    {rawViewsToString(
                      video?.items[0]?.statistics?.viewCount || ""
                    )}{" "}
                    views
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!video ? (
                  <Skeleton width={20} className="rounded-2xl" />
                ) : (
                  <div className="text-sm tracking-wide text-zinc-400">
                    {video?.items[0]?.contentDetails?.definition === "hd" ? (
                      <PiHighDefinitionFill className="w-6 h-6" />
                    ) : (
                      ""
                    )}
                  </div>
                )}
                {video?.items[0]?.contentDetails?.caption === "true" && (
                  <div className="text-sm tracking-wide text-zinc-400">
                    <PiClosedCaptioningFill className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <FcClock color="black" className="w-6 h-6" />
                {!video ? (
                  <Skeleton width={100} className="rounded-2xl" />
                ) : (
                  <div className="text-sm tracking-wide text-zinc-400">
                    {elapsedTime(date)} ago
                  </div>
                )}
              </div>
            </div>
            {!video ? (
              <Skeleton width={200} className="rounded-2xl" />
            ) : (
              <div className="text-ellipsis line-clamp-2">
                {video?.items[0]?.snippet?.title || ""}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-start gap-1">
          <div className="grid w-8 h-8 overflow-hidden rounded-full place-items-center">
            {!channel ? (
              <Skeleton width={24} height={24} circle className="-top-1" />
            ) : (
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/channel/${channel?.items[0]?.id}`);
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full cursor-pointer hover:shadow-[0_0_0_3px_rgb(250_204_50)] focus:shadow-[0_0_0_3px_rgb(250_204_50)]"
                src={channel?.items[0]?.snippet?.thumbnails?.high?.url}
                alt="T"
              />
            )}
          </div>
          {!channel ? (
            <Skeleton width={100} className="rounded-2xl" />
          ) : (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/channel/${channel?.items[0]?.id}`);
                }}
                className="text-sm tracking-wide fold-bold text-zinc-300 hover:text-zinc-400 focus:text-zinc-400 text-ellipsis"
              >
                {channel?.items[0]?.snippet?.title || ""}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default VideoCard;
