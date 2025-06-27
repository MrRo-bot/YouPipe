import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { extractColors } from "extract-colors";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addLikedVideos } from "../features/likedVideosSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
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

  useQuery({
    queryKey: ["likedVideos", fetchMore],
    queryFn: async () => {
      try {
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
        if (!res.ok) throw new Error("Error in fetching liked videos");
        const likedVideosList = await res.json();
        dispatch(addLikedVideos(likedVideosList));
        setFetchMore(false);
        return likedVideosList;
      } catch (error) {
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
          toast.error(`${error instanceof Error ? error.message : error}`, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "!toastGradientError !font-bold !text-zinc-50",
            transition: Bounce,
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedVideos?.items[0]?.snippet?.thumbnails?.default?.url]);

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <div
        className={`mb-2 mt-3 max-h-[90vh] rounded-2xl mx-4 ${
          !isOpen ? "w-[85vw]" : "w-full"
        }  flex`}
      >
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut", delay: 0.2 }}
          style={{
            background: `linear-gradient(to bottom, rgba(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue},0.3) 33%, rgba(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue},0.01) 100%)`,
          }}
          className="flex flex-col w-3/12 h-[87vh] rounded-2xl my-1 px-6"
        >
          <div className="my-6 overflow-hidden rounded-2xl aspect-video">
            {!likedVideos?.items[0]?.snippet?.thumbnails?.high?.url ? (
              <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
            ) : (
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
            )}
          </div>
          <h1 className="text-4xl font-bold">Liked videos</h1>
          <h3 className="mt-5 font-semibold tracking-tighter">
            Chhavimani Choubey
          </h3>
          <div className="flex gap-2 mt-2 font-medium tracking-tighter text-zinc-400">
            <span>
              {likedVideos?.items?.length
                ? likedVideos?.pageInfo?.totalResults?.toLocaleString() +
                  " videos"
                : "0 videos"}
            </span>
          </div>
        </motion.div>

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
              <LikedVideosCard key={data?.id} likedvideo={data} index={index} />
            )}
            endReached={() => setTimeout(() => setFetchMore(true), 1000)}
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
