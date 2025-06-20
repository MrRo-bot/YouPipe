import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  PiClosedCaptioningFill,
  PiDotsThreeOutlineVerticalFill,
} from "react-icons/pi";
import { FcClock, FcStart } from "react-icons/fc";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";

import {
  PlaylistItemType,
  TokensType,
  VideosListType,
} from "../../types/types";

export const UploadCards = ({
  videoItem,
  uniqueKey,
}: {
  videoItem: PlaylistItemType;
  uniqueKey: string;
}) => {
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const videoParts = ["statistics", "snippet", "contentDetails"];

  const { isLoading, data: video } = useQuery<VideosListType>({
    queryKey: ["videoStat", videoItem?.contentDetails?.videoId],
    queryFn: async () => {
      const videoRes = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${
          videoItem?.contentDetails?.videoId
        }&part=${videoParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const video = await videoRes.json();
      return video;
    },
    enabled: !!videoItem?.contentDetails?.videoId,
  });

  const date = new Date(video?.items[0]?.snippet?.publishedAt || "").getTime();

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <AnimatePresence>
        <motion.div
          key={uniqueKey}
          variants={{
            hidden: { scale: 0.95 },
            visible: { scale: 1 },
          }}
          initial={"hidden"}
          whileInView={"visible"}
          className={`z-0 my-1 flex flex-col justify-between h-full gap-1 p-1 transition-all cursor-pointer group max-w-96 active:bg-zinc-600/70 glass rounded-2xl`}
        >
          <div className="flex flex-col gap-2">
            <div className="relative overflow-hidden aspect-video rounded-2xl">
              {isLoading ? (
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
                  {video?.items[0]?.contentDetails?.caption === "true" && (
                    <div className="absolute z-50 text-xs px-0.5 text-white rounded-none bottom-1 left-1 glass-dark">
                      <PiClosedCaptioningFill className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                    {videoDuration(
                      video?.items[0]?.contentDetails?.duration || "00:0"
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 px-1">
              {isLoading ? (
                <Skeleton width={200} className="rounded-2xl" />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="w-10/12 text-ellipsis line-clamp-2">
                    {video?.items[0]?.snippet?.localized?.title || ""}
                  </div>
                  <div className="mt-1 transition hover:scale-105 focus:scale-105">
                    <PiDotsThreeOutlineVerticalFill />
                  </div>
                </div>
              )}
              <div className="flex justify-start gap-2">
                <div className="flex items-center">
                  <FcStart className="w-4 h-4 mr-0.5" />
                  {isLoading ? (
                    <Skeleton width={100} className="rounded-2xl" />
                  ) : (
                    <div className="text-xs tracking-tighter text-zinc-400">
                      {`${rawViewsToString(
                        video?.items[0]?.statistics?.viewCount || ""
                      )} views`}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <FcClock color="black" className="w-4 h-4 mr-0.5" />
                  {isLoading ? (
                    <Skeleton width={100} className="rounded-2xl" />
                  ) : (
                    <div className="text-xs tracking-tight text-zinc-400">
                      {elapsedTime(date)} ago
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};
