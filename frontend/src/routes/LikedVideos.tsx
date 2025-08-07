import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { extractColors } from "extract-colors";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addLikedVideos } from "../features/likedVideosSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

import customToastFunction from "../utils/Toastify";

import LikedVideosCard from "../components/likedVideos/LikedVideosCard";

import { TokensType } from "../types/types";

const LikedVideos = () => {
  const [fetchMore, setFetchMore] = useState(true);
  const [extractedColors, setExtractedColors] = useState([
    {
      hex: "#000000",
      red: 255,
      green: 255,
      blue: 255,
      area: 1,
      hue: 0,
      saturation: 1,
      lightness: 1,
      intensity: 1,
    },
  ]);

  const dispatch = useAppDispatch();
  const likedVideos = useAppSelector((state) => state.likedVideos);
  const isOpen = useAppSelector((state) => state.hamburger);

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

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

  const { data, isLoading } = useQuery({
    queryKey: ["likedVideos", fetchMore],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?part=${parts.join(
            ","
          )}&maxResults=50&myRating=like&key=${import.meta.env.VITE_API_KEY}${
            fetchMore && likedVideos?.nextPageToken
              ? `&pageToken=${likedVideos?.nextPageToken}`
              : ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (!res.ok && res.status >= 400)
          throw new Error(`Error ${res.status} in fetching liked videos`);
        const likedVideosList = await res.json();
        dispatch(addLikedVideos(likedVideosList));
        setFetchMore(false);
        return likedVideosList;
      } catch (error) {
        customToastFunction(
          `❌ ${error instanceof Error ? error.message : error}`,
          "error"
        );
      }
    },
    enabled: !!fetchMore,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (likedVideos?.items[0]?.snippet?.thumbnails?.default?.url) {
      extractColors(likedVideos?.items[0]?.snippet?.thumbnails?.default?.url, {
        crossOrigin: "anonymous",
      })
        .then((data) => {
          setExtractedColors(data);
        })
        .catch((error) =>
          customToastFunction(
            `${error instanceof Error ? error.message : error}`,
            "error"
          )
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedVideos?.items[0]?.snippet?.thumbnails?.default?.url]);

  console.log(
    `if data giving error object: ${data?.error},
    if data dont have error but page info is zero: ${JSON.stringify(
      data
    )} ${!data?.error} and ${data?.pageInfo?.totalResults === 0}`
  );
  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <div
        className={`max-h-[90vh] rounded-2xl mx-1 md:ml-4 mt-3 md:mr-2 mb-2 ${
          !isOpen
            ? "md:w-[70vw] lg:w-[75vw] xl:w-[80vw] 2xl:w-[85vw] "
            : "w-full"
        }  flex flex-col lg:flex-row`}
      >
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut", delay: 0.2 }}
          style={{
            background: `linear-gradient(to bottom, rgba(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue},0.3) 33%, rgba(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue},0.01) 100%)`,
          }}
          className="flex flex-col md:flex-row lg:flex-col px-2 lg:w-3/12 lg:h-[87vh] rounded-2xl lg:my-1"
        >
          <div className="my-2 overflow-hidden rounded-2xl aspect-video sm:w-[70%] sm:mx-auto lg:w-full">
            {likedVideos?.items[0]?.snippet?.thumbnails?.high?.url ? (
              <img
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
                src={
                  likedVideos?.items
                    ? likedVideos?.items[0]?.snippet?.thumbnails?.high?.url
                    : ""
                }
                alt=""
              />
            ) : (
              <Skeleton
                height={"100%"}
                className="md:!w-[50vw] -top-1 rounded-2xl"
              />
            )}
          </div>
          <div className="md:mt-1 md:pl-2">
            <h1 className="text-2xl font-bold md:text-3xl xl:text-4xl text-zinc-50">
              Liked videos
            </h1>
            <h3 className="mt-2 text-sm font-semibold tracking-tighter lg:text-base text-zinc-200">
              Chhavimani Choubey
            </h3>
            <div className="flex gap-2 mt-2 text-sm font-medium tracking-tighter lg:text-base text-zinc-400">
              <span>
                {likedVideos?.items?.length
                  ? likedVideos?.pageInfo?.totalResults?.toLocaleString() +
                    " videos"
                  : "0 videos"}
              </span>
            </div>
          </div>
        </motion.div>

        {isLoading && (
          <FidgetSpinner
            visible={true}
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper size-16 md:size-20 mx-auto"
          />
        )}

        {data?.error && (
          <div className="col-start-1 px-6 py-3 mx-auto text-center transition-colors lg:px-10 xl:px-14 2xl:px-20 -col-end-1 w-max glass hover:bg-indigo-600/20 focus:bg-indigo-600/20">
            <i className="block pt-4 text-xs md:text-sm xl:text-base">
              Login to fetch liked videos from your account
            </i>
          </div>
        )}

        {!data?.error && data?.pageInfo?.totalResults === 0 ? (
          <div className="mx-auto text-2xl italic font-bold w-max">
            Not Found
          </div>
        ) : (
          <Virtuoso
            className="lg:!w-9/12 lg:!min-h-[90vh] !overflow-y-auto !hideScrollbar !flex !flex-col !gap-4 !rounded-2xl lg:!mx-2 !my-1"
            increaseViewportBy={100}
            data={likedVideos?.items}
            totalCount={likedVideos?.pageInfo?.totalResults}
            itemContent={(index, data) => (
              <LikedVideosCard key={data?.id} likedvideo={data} index={index} />
            )}
            endReached={() =>
              setTimeout(
                () =>
                  likedVideos?.items?.length <
                    likedVideos?.pageInfo?.totalResults && setFetchMore(true),
                1000
              )
            }
            context={likedVideos}
            components={{
              Footer: ({ context: likedVideos }) => {
                return likedVideos &&
                  likedVideos?.items?.length <
                    likedVideos?.pageInfo?.totalResults ? (
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
                  <div className="mx-auto text-lg italic font-bold w-max">
                    End
                  </div>
                );
              },
            }}
          />
        )}
      </div>
    </SkeletonTheme>
  );
};

export default LikedVideos;
