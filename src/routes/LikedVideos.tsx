import { useQuery } from "@tanstack/react-query";

import { AnimatePresence, motion } from "framer-motion";

import {
  PiDownloadFill,
  PiArrowFatRightFill,
  PiShuffleFill,
} from "react-icons/pi";

import { useAppDispatch, useAppSelector } from "../app/store";

import { usePersistedState } from "../hooks/usePersistentStorage";
import LikedVideosCard from "../components/LikedVideosCard";
import { addLikedVideos } from "../features/likedVideosSlice";
import { TokensType } from "../types/types";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useState } from "react";

const LikedVideos = () => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const dispatch = useAppDispatch();

  const likedVideosData = useAppSelector((state) => state.likedvideos);
  const isOpen = useAppSelector((state) => state.hamburger);

  const parts = [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "statistics",
    "status",
    "topicDetails",
  ];

  const { status } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=${parts.join(
          ","
        )}&maxResults=50&myRating=like&key=${token?.access_token}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const playlist = await res.json();
      dispatch(addLikedVideos(playlist));
      return playlist;
    },
  });

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          className={`mb-2 mt-3 max-h-[90vh] rounded-2xl mx-4 ${
            !isOpen ? "w-[85vw]" : "w-full"
          }  flex`}
        >
          <div
            style={{
              background: `linear-gradient(to bottom, rgba(15,15,15) 33%, rgba(15,15,15,0.100) 100%)`,
            }}
            className="flex flex-col w-3/12 h-[87vh] rounded-2xl my-1 px-6"
          >
            <div className="my-6 overflow-hidden rounded-2xl aspect-video">
              {likedVideosData?.items?.length > 0 && (
                <img
                  loading="lazy"
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
                  className="object-cover w-full h-full"
                  src={
                    likedVideosData?.items[0]?.snippet?.thumbnails?.high?.url
                  }
                  alt={likedVideosData?.items[0]?.snippet?.title[0]}
                />
              )}
              {!isImgLoaded && (
                <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
              )}
            </div>
            <h1 className="text-2xl font-bold">Liked videos</h1>
            <h3 className="mt-5 text-sm font-semibold tracking-tighter">
              Chhavimani Choubey
            </h3>
            <div className="flex gap-2 mt-2 text-sm font-medium tracking-tighter text-zinc-400">
              <span>
                {likedVideosData?.items?.length > 0
                  ? likedVideosData?.pageInfo?.totalResults?.toLocaleString() +
                    " videos"
                  : "0 videos"}
              </span>{" "}
              •<span>No views</span> • <span>Updated today</span>
            </div>

            <div className="grid w-10 h-10 p-2 mt-4 transition rounded-full cursor-pointer place-items-center hover:bg-zinc-400/25 focus:bg-zinc-400/25 bg-zinc-200/25">
              <PiDownloadFill className="w-full h-full" />
            </div>

            <div className="flex gap-2 mt-4 justify-evenly">
              <div className="flex items-center justify-center w-full gap-1 p-2 text-sm font-semibold text-black transition rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-zinc-200/75 focus:bg-zinc-200/75">
                <PiArrowFatRightFill className="w-6 h-6" />
                Play all
              </div>
              <div className="flex items-center justify-center w-full gap-1 p-2 text-sm font-semibold transition rounded-full cursor-pointer place-items-center bg-zinc-200/25 focus:bg-zinc-400/25 hover:bg-zinc-400/25">
                <PiShuffleFill className="w-6 h-6" />
                Shuffle
              </div>
            </div>
          </div>
          <div className="w-9/12 max-h-[90vh] overflow-y-auto hideScrollbar flex flex-col gap-4 rounded-2xl mx-2 my-1">
            {status === "success" &&
              likedVideosData?.items?.map((likedvideo, index) => (
                <LikedVideosCard
                  key={likedvideo.id}
                  likedvideo={likedvideo}
                  index={index}
                />
              ))}
            {likedVideosData?.items?.length > 0 ? (
              <div className="loading" />
            ) : (
              <div className="mx-auto pageLoader" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default LikedVideos;
