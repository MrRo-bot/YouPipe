import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { SearchType, VideoListType } from "../types/types";
import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../utils/functions";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useAppSelector } from "../app/store";

const SearchCard = ({ search }: { search: SearchType }) => {
  //storing channel stats from subscription details
  const [videoStats, setVideoStats] = useState<VideoListType>();

  //for skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  //creating date value from ISO 8601 format
  const myDate = new Date(search?.snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  //getting token data from redux store
  const tokenData = useAppSelector((state) => state.token);

  //parts to be called with the API
  const parts = ["statistics", "snippet", "contentDetails"];

  //video, playlist or channel
  const kind = search?.id?.kind.split("#")[1];

  //effect for using subscribers id and getting channel data from it to display in subscription section
  useEffect(() => {
    if (kind === "video") {
      (async () => {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?id=${
              search?.id?.videoId
            }&part=${parts.join(",")}&maxResults=50&key=${
              import.meta.env.VITE_API_KEY
            }`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${tokenData?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Oh no! didn't get video data");
          const channel = await res.json();
          if (channel) setVideoStats(channel);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);

  return (
    <div className="py-4">
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
          className="flex items-center justify-between gap-1 p-3 transition-all cursor-pointer hover:bg-zinc-800/70 rounded-2xl"
        >
          <div className="flex">
            <div className="relative overflow-hidden min-w-96 w-96 aspect-video rounded-2xl">
              {!search?.snippet?.thumbnails?.high?.url ? (
                <Skeleton height={"100%"} className="-top-1" />
              ) : (
                <>
                  <img
                    onLoad={() => setIsImgLoaded(!isImgLoaded)}
                    className="object-cover w-full h-full"
                    src={search?.snippet?.thumbnails?.high?.url}
                    alt=""
                  />
                  <div className="absolute z-40 p-1 text-xs text-white bottom-1 right-1 glass-dark">
                    {videoDuration(
                      videoStats?.items[0]?.contentDetails?.duration || "0:00"
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col ml-3 flex-start">
              {isImgLoaded ? (
                <h3 className="w-full text-lg font-semibold text-ellipsis line-clamp-2">
                  {search?.snippet?.title || ""}
                </h3>
              ) : (
                <Skeleton
                  width={300}
                  height={27}
                  className="top-2 rounded-2xl"
                />
              )}

              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                {isImgLoaded ? (
                  `${rawViewsToString(
                    videoStats?.items[0]?.statistics?.viewCount || ""
                  )} views • ${elapsedTime(result) || ""} ago`
                ) : (
                  <Skeleton
                    width={150}
                    height={20}
                    className="top-5 rounded-2xl"
                  />
                )}
              </div>

              {isImgLoaded ? (
                <>
                  <div className="py-4 tracking-wide text-zinc-300 text-ellipsis">
                    {search?.snippet?.channelTitle}
                  </div>
                </>
              ) : (
                <Skeleton width={100} className="rounded-2xl" />
              )}

              <div className="w-full text-sm text-ellipsis line-clamp-1 text-zinc-400">
                {isImgLoaded ? (
                  search?.snippet?.description
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
    </div>
  );
};

export default SearchCard;
