/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";
import { usePersistedState } from "../../hooks/usePersistentStorage";
import {
  PlaylistItemType,
  TokensType,
  VideosListType,
} from "../../types/types";

const PlaylistOverviewCard = ({
  playlistItem,
  index,
}: {
  playlistItem: PlaylistItemType;
  index: number;
}) => {
  const [videoStat, setVideoStat] = useState<VideosListType>();
  //creating date value from ISO 8601 format
  const myDate = new Date(playlistItem?.contentDetails?.videoPublishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  //for skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const navigate = useNavigate();

  const [tokenData] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //query for getting video data
  useEffect(() => {
    (async () => {
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
            Authorization: `Bearer ${tokenData?.access_token}`,
          },
        }
      );
      const videoStat = await resVideo.json();
      setVideoStat(videoStat);
    })();
  }, [playlistItem?.contentDetails?.videoId]);

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      //navigate to video
      onClick={() =>
        navigate(`/video/${playlistItem?.contentDetails?.videoId}`)
      }
      className="flex items-center justify-between gap-1 p-2 transition-all cursor-pointer hover:bg-zinc-800/70 active:bg-zinc-600/70 glass rounded-2xl"
    >
      <div className="flex">
        <div className="self-center mr-2">{index + 1}</div>
        <div className="relative overflow-hidden w-52 aspect-video rounded-2xl">
          {!playlistItem?.snippet?.thumbnails?.high?.url ? (
            <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
          ) : (
            <>
              <img
                referrerPolicy="no-referrer"
                onLoad={() => setIsImgLoaded(!isImgLoaded)}
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
            {isImgLoaded ? (
              <h3 className="text-lg text-ellipsis line-clamp-1">
                {playlistItem?.snippet?.title}
              </h3>
            ) : (
              <Skeleton width={300} height={27} className="top-2 rounded-2xl" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {isImgLoaded ? (
              `${
                playlistItem?.snippet?.videoOwnerChannelTitle || ""
              } • ${rawViewsToString(
                videoStat?.items[0]?.statistics?.viewCount || ""
              )} views • ${rawViewsToString(
                videoStat?.items[0]?.statistics?.likeCount || ""
              )} likes • ${rawViewsToString(
                videoStat?.items[0]?.statistics?.commentCount || ""
              )} comments • ${elapsedTime(result) || ""} ago`
            ) : (
              <Skeleton width={150} height={20} className="top-5 rounded-2xl" />
            )}
          </div>
        </div>
      </div>

      <PiDotsThreeOutlineVerticalFill className="cursor-pointer min-w-5 min-h-5 text-zinc-200" />
    </motion.div>
  );
};

export default PlaylistOverviewCard;
