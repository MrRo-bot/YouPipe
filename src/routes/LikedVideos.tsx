import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import {
  PiDownloadFill,
  PiArrowFatRightFill,
  PiShuffleFill,
} from "react-icons/pi";

import { Virtuoso } from "react-virtuoso";

import { LikedVideosListType, TokensType } from "../types/types";
import { useAppDispatch, useAppSelector } from "../app/store";
import { addLikedVideos } from "../features/likedVideosSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import LikedVideosCard from "../components/LikedVideosCard";

//footer shows loading or end of list
const Footer = ({ context: likedVideos }: { context: LikedVideosListType }) => {
  return likedVideos?.items?.length < likedVideos?.pageInfo?.totalResults ? (
    <ThreeDots
      visible={true}
      height="50"
      width="50"
      color="#3bf6fcbf"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass="justify-center"
    />
  ) : (
    <div className="mx-auto text-lg italic font-bold w-max">End</div>
  );
};

const LikedVideos = () => {
  //skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  //triggers query for fetching more data
  const [fetchMore, setFetchMore] = useState(true);

  //getting token from localStorage
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //dispatching redux reducers
  const dispatch = useAppDispatch();

  //getting data from store
  const likedVideos = useAppSelector((state) => state.likedVideos);
  const isOpen = useAppSelector((state) => state.hamburger);

  //parts used in API calls
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

  //query for getting liked videos list and storing in redux (triggered by fetchMore state as well)
  useQuery({
    queryKey: ["likedvideos", fetchMore],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=${parts.join(
          ","
        )}&maxResults=50&myRating=like&key=${
          import.meta.env.VITE_API_KEY
        }&pageToken=${fetchMore ? likedVideos?.nextPageToken : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const likedVideosList = await res.json();
      dispatch(addLikedVideos(likedVideosList));
      setFetchMore(false);
      return likedVideosList;
    },
    enabled: !!fetchMore,
    refetchOnWindowFocus: false,
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
              {likedVideos?.items?.length > 1 && (
                <img
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
                  className="object-cover w-full h-full"
                  src={
                    likedVideos?.items
                      ? likedVideos?.items[0]?.snippet?.thumbnails?.high?.url
                      : ""
                  }
                  alt=""
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
                {likedVideos?.items?.length
                  ? likedVideos?.pageInfo?.totalResults?.toLocaleString() +
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

          {/* Virtuoso virtualized rendering of liked videos list for increased rendering performance */}
          {likedVideos?.items?.length <= 1 ? (
            <FidgetSpinner
              visible={true}
              height="80"
              width="80"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper mx-auto"
            />
          ) : (
            <Virtuoso
              className="!w-9/12 !min-h-[90vh] !overflow-y-auto !hideScrollbar !flex !flex-col !gap-4 !rounded-2xl !mx-2 !my-1"
              increaseViewportBy={100}
              data={likedVideos?.items}
              totalCount={likedVideos?.pageInfo?.totalResults}
              itemContent={(index, data) => (
                <LikedVideosCard
                  key={data?.id}
                  likedvideo={data}
                  index={index}
                />
              )}
              endReached={() => setTimeout(() => setFetchMore(true), 500)}
              context={likedVideos}
              components={{ Footer }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default LikedVideos;
