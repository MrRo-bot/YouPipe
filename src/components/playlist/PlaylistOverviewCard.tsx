import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";
import { usePersistedState } from "../../hooks/usePersistentStorage";
import { PlaylistItemType, TokensType } from "../../types/types";
import { useQuery } from "@tanstack/react-query";

const PlaylistOverviewCard = ({
  playlistItem,
  index,
}: {
  playlistItem: PlaylistItemType;
  index: number;
}) => {
  const date = new Date(
    playlistItem?.contentDetails?.videoPublishedAt || ""
  ).getTime();

  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const { data: videoStat, isLoading } = useQuery({
    queryKey: ["playlistVideoStats", playlistItem?.contentDetails?.videoId],
    queryFn: async () => {
      const resVideo = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${
          playlistItem?.contentDetails?.videoId
        }&part=status,statistics,contentDetails&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const videoStat = await resVideo.json();
      return videoStat;
    },
  });

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      onClick={() =>
        navigate(`/video/${playlistItem?.contentDetails?.videoId}`)
      }
      className="flex items-center justify-between gap-1 p-2 transition-colors cursor-pointer hover:bg-indigo-600/20 focus:bg-indigo-600/20 active:bg-zinc-600/70 glass rounded-2xl"
    >
      <div className="flex">
        <div className="self-center mr-2">{index + 1}</div>
        <div className="relative overflow-hidden w-52 aspect-video rounded-2xl">
          {isLoading ? (
            <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
          ) : (
            <>
              <img
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
                src={playlistItem?.snippet?.thumbnails?.high?.url}
                alt=""
              />
              <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                {videoDuration(
                  videoStat?.items[0]?.contentDetails?.duration || "00:0"
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col ml-3 flex-start">
          <div className="relative flex items-start justify-between gap-1">
            {isLoading ? (
              <Skeleton width={300} height={27} className="top-2 rounded-2xl" />
            ) : (
              <h3 className="text-lg text-ellipsis line-clamp-1 text-zinc-50">
                {playlistItem?.snippet?.title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {isLoading ? (
              <Skeleton width={150} height={20} className="top-5 rounded-2xl" />
            ) : (
              <>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/channel/${playlistItem?.snippet?.videoOwnerChannelId}`
                    );
                  }}
                  className="transition-colors hover:text-slate-50 focus:text-slate-50"
                >
                  {playlistItem?.snippet?.videoOwnerChannelTitle || ""}
                </span>
                <span>
                  {`• ${rawViewsToString(
                    videoStat?.items[0]?.statistics?.viewCount || ""
                  )} views • ${rawViewsToString(
                    videoStat?.items[0]?.statistics?.likeCount || ""
                  )} likes • ${rawViewsToString(
                    videoStat?.items[0]?.statistics?.commentCount || ""
                  )} comments • ${elapsedTime(date) || ""} ago`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistOverviewCard;
