import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { usePersistedState } from "../../hooks/usePersistentStorage";
import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";
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
          if (!res.ok) throw new Error("Oh no! didn't get video data");
          const video = await res.json();
          setVideoStats(video);
          setVideoLoading(false);
        } catch (error) {
          setVideoLoading(true);
          toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "!toastGradientError !font-bold !text-zinc-50",
            transition: Bounce,
          });
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
      className="py-4"
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
          className="flex items-center justify-between gap-1 p-3 transition-all cursor-pointer glass hover:bg-zinc-800/70 rounded-2xl"
        >
          <div className="flex w-full">
            <div className="relative self-start overflow-hidden rounded-2xl min-w-96 w-96 aspect-video">
              {videoLoading ? (
                <Skeleton height={"100%"} className="-top-1" />
              ) : (
                <>
                  <img
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                    src={videoStats?.items[0]?.snippet?.thumbnails?.high?.url}
                    alt=""
                  />

                  <div
                    className={`absolute z-50 p-1 text-xs text-white bottom-1 right-1 glass-dark ${
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
            <div className="flex flex-col w-2/3 ml-3 flex-start">
              {videoLoading ? (
                <Skeleton
                  width={300}
                  height={27}
                  className="top-2 rounded-2xl"
                />
              ) : (
                <h3 className="w-full text-2xl font-semibold text-ellipsis line-clamp-2">
                  {videoStats?.items[0]?.snippet?.title || ""}
                </h3>
              )}

              <div className="flex items-center gap-2 pt-1 text-sm font-medium text-zinc-300">
                {videoLoading ? (
                  <Skeleton
                    width={150}
                    height={20}
                    className="top-5 rounded-2xl"
                  />
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

              {videoLoading ? (
                <Skeleton width={100} className="rounded-2xl" />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("open channel");
                  }}
                  className="pt-1 text-xl tracking-wide text-zinc-200 text-ellipsis"
                >
                  {videoStats?.items[0]?.snippet?.channelTitle}
                </div>
              )}

              {videoLoading ? (
                <Skeleton
                  width={150}
                  height={20}
                  className="top-5 rounded-2xl"
                />
              ) : (
                <div className="w-full my-2 text-sm text-zinc-400 line-clamp-3 text-ellipsis">
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
