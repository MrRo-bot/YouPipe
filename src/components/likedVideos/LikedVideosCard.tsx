import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";
import { LikedVideosType } from "../../types/types";

const LikedVideosCard = ({
  likedvideo,
  index,
}: {
  likedvideo: LikedVideosType;
  index: number;
}) => {
  const navigate = useNavigate();

  const date = new Date(likedvideo?.snippet?.publishedAt || "").getTime();

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
        onClick={() => navigate(`/video/${likedvideo?.id}`)}
        className="flex items-start justify-between gap-1 p-2 transition-colors cursor-pointer hover:bg-indigo-600/20 focus:bg-indigo-600/20 active:bg-zinc-600/70 rounded-2xl"
      >
        <div className="flex">
          <div className="self-center mr-1 text-center">{index + 1}</div>
          <div className="relative h-32 overflow-hidden w-52 selection:aspect-video rounded-2xl">
            {!likedvideo?.snippet?.thumbnails?.high?.url ? (
              <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
            ) : (
              <>
                <img
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                  src={likedvideo?.snippet?.thumbnails?.high?.url}
                  alt=""
                />
                <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                  {videoDuration(
                    likedvideo?.contentDetails?.duration || "00:0"
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col ml-3 flex-start">
            <div className="relative flex items-start justify-between gap-1">
              {likedvideo?.snippet?.title ? (
                <h3 className="w-full text-lg text-ellipsis line-clamp-1 text-zinc-50">
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
              {likedvideo?.snippet?.channelTitle &&
              likedvideo?.statistics?.viewCount ? (
                <>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/channel/${likedvideo?.snippet?.channelId}`);
                    }}
                    className="transition-colors hover:text-slate-50 focus:text-slate-50"
                  >
                    {likedvideo?.snippet?.channelTitle || ""}
                  </span>
                  {`• ${rawViewsToString(
                    likedvideo?.statistics?.viewCount || ""
                  )} views • ${elapsedTime(date) || ""} ago`}
                </>
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
      </motion.div>
    </SkeletonTheme>
  );
};

export default LikedVideosCard;
