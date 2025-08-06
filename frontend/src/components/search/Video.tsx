import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { PiUserFill } from "react-icons/pi";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";
import customToastFunction from "../../utils/Toastify";

import { SearchType, TokensType, VideosListType } from "../../types/types";

const Video = ({ search, kind }: { search: SearchType; kind: string }) => {
  const [videoStats, setVideoStats] = useState<VideosListType>();
  const [videoLoading, setVideoLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const parts = ["statistics", "snippet", "contentDetails"];

  useEffect(() => {
    (async () => {
      if (kind === "video") {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?id=${
              search?.id?.videoId
            }&part=${parts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${token?.access_token}`,
              },
            }
          );
          if (!res.ok && res.status >= 400)
            throw new Error(`Error ${res.status} in getting video data`);
          const video = await res.json();
          setVideoStats(video);
          setVideoLoading(false);
        } catch (error) {
          setVideoLoading(true);
          customToastFunction(
            `❌ ${error instanceof Error ? error.message : error}`,
            "error"
          );
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.id?.videoId]);

  const date = new Date(
    videoStats?.items[0]?.snippet?.publishedAt || ""
  ).getTime();
  return (
    <div
      className="py-2"
      onClick={() => navigate(`/video/${videoStats?.items[0]?.id}`)}
    >
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
          className="flex items-center justify-between gap-1 p-1 overflow-hidden transition-colors cursor-pointer md:p-3 hover:bg-indigo-600/20 focus:bg-indigo-600/20 glass rounded-2xl"
        >
          <div className="flex w-full">
            <div className="relative self-start overflow-hidden min-w-36 sm:max-w-64 md:max-w-72 lg:max-w-min-w-80 xl:max-w-96 aspect-video rounded-2xl">
              {videoLoading ? (
                <Skeleton className="absolute inset-0 min-w-36 sm:min-w-64 md:min-w-72 lg:min-w-min-w-80 xl:min-w-96 aspect-video -top-1" />
              ) : (
                <>
                  <img
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                    src={
                      videoStats?.items[0]?.snippet?.thumbnails?.high?.url || ""
                    }
                    alt=""
                  />
                  <div
                    className={`absolute z-50 md:p-1 p-0.5 text-xs text-white bottom-1 right-1 glass-dark ${
                      videoStats?.items[0]?.contentDetails?.duration ===
                        "P0D" && "animate-pulse"
                    }`}
                  >
                    {videoStats?.items[0]?.contentDetails?.duration === "P0D"
                      ? "Live"
                      : videoDuration(
                          videoStats?.items[0]?.contentDetails?.duration ||
                            "00:0"
                        )}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col w-full ml-1 min-w-[66%] md:ml-3 flex-start">
              {videoLoading ? (
                <Skeleton className="max-w-[40vw] rounded-2xl" />
              ) : (
                <h3 className="w-full text-sm font-semibold sm:text-lg md:text-xl lg:text-2xl text-ellipsis line-clamp-1 lg:line-clamp-2 text-zinc-50">
                  {videoStats?.items[0]?.snippet?.title || ""}
                </h3>
              )}

              {window.innerWidth > 640 && (
                <div className="flex items-center gap-2 pt-1 text-sm font-medium text-zinc-300 line-clamp-1 text-ellipsis">
                  {videoLoading ? (
                    <Skeleton className="min-w-[20vw] rounded-2xl" />
                  ) : (
                    `${rawViewsToString(
                      videoStats?.items[0]?.statistics?.viewCount || ""
                    )} views • ${
                      elapsedTime(date) || ""
                    } ago • ${rawViewsToString(
                      videoStats?.items[0]?.statistics?.likeCount || ""
                    )} likes • ${rawViewsToString(
                      videoStats?.items[0]?.statistics?.commentCount || ""
                    )} comments`
                  )}
                </div>
              )}

              {videoLoading ? (
                <Skeleton className="max-w-[10vw] rounded-2xl" />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/channel/${videoStats?.items[0]?.snippet?.channelId}`
                    );
                  }}
                  className="flex items-center gap-1 pt-1 text-xs font-semibold transition-colors sm:text-sm md:text-lg hover:text-slate-500 focus:text-slate-500 text-zinc-300 text-ellipsis"
                >
                  <span>
                    <PiUserFill className="text-yellow-200" />
                  </span>{" "}
                  {videoStats?.items[0]?.snippet?.channelTitle}
                </div>
              )}

              {videoLoading ? (
                <Skeleton className="max-w-[30vw] rounded-2xl" />
              ) : (
                <div className="w-full my-2 text-xs sm:text-sm text-zinc-400 line-clamp-1 sm:line-clamp-2 md:line-clamp-3 text-ellipsis">
                  {videoStats?.items[0]?.snippet?.description}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </SkeletonTheme>
    </div>
  );
};

export default Video;
