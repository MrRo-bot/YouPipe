import { motion } from "framer-motion";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { RiDraggable } from "react-icons/ri";
import { PlaylistItemType } from "../types/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { elapsedTime } from "../utils/functions";
import Skeleton from "react-loading-skeleton";

const PlaylistOverviewCard = ({
  playlistItem,
}: {
  playlistItem: PlaylistItemType;
}) => {
  //creating date value from ISO 8601 format
  const myDate = new Date(playlistItem?.contentDetails?.videoPublishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  //for skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const navigate = useNavigate();

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
      className="flex items-center justify-between gap-1 p-2 transition-all cursor-pointer hover:bg-zinc-800/70 glass rounded-2xl"
    >
      <div className="flex">
        <div className="self-center mr-2">{<RiDraggable />}</div>
        <div className="relative overflow-hidden w-52 aspect-video rounded-2xl">
          {!playlistItem?.snippet?.thumbnails?.high?.url ? (
            <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
          ) : (
            <>
              <img
                onLoad={() => setIsImgLoaded(!isImgLoaded)}
                className="object-cover w-full h-full"
                src={playlistItem?.snippet?.thumbnails?.high?.url}
                alt=""
              />
            </>
          )}
        </div>
        <div className="flex flex-col ml-3 flex-start">
          <div className="relative flex items-start justify-between gap-1">
            <h3 className="text-lg text-ellipsis line-clamp-1">
              {playlistItem?.snippet?.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {playlistItem?.snippet?.videoOwnerChannelTitle} • 1.7M views •{" "}
            {elapsedTime(result)} ago
          </div>
        </div>
      </div>

      <PiDotsThreeOutlineVerticalFill className="cursor-pointer min-w-5 min-h-5 text-zinc-200" />
    </motion.div>
  );
};

export default PlaylistOverviewCard;
