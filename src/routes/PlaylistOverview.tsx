import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";
import { extractColors } from "extract-colors";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addPlayItems } from "../features/playlistOverviewSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { elapsedTime } from "../utils/functions";
import PlaylistOverviewCard from "../components/playlist/PlaylistOverviewCard";
import { TokensType } from "../types/types";

const PlaylistOverview = () => {
  const [fetchMore, setFetchMore] = useState(true);

  const { playlistId } = useParams();

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
  const isOpen = useAppSelector((state) => state.hamburger);
  const playlistOverview = useAppSelector((state) => state.playlistOverview);
  const currPlaylist = useAppSelector((state) =>
    state.playlist.items.filter((list) => list.id === playlistId)
  );

  const date = new Date(currPlaylist[0].snippet?.publishedAt || "")?.getTime();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  useQuery({
    queryKey: ["playlistItems", fetchMore],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet,status&playlistId=${playlistId}&maxResults=50&key=${
          import.meta.env.VITE_API_KEY
        }&pageToken=${fetchMore ? playlistOverview?.nextPageToken : ""}
        `,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const playlistItems = await res.json();
      dispatch(addPlayItems(playlistItems));
      setFetchMore(false);
      return playlistItems;
    },
    enabled: !!fetchMore,
  });

  useEffect(() => {
    if (currPlaylist[0]?.snippet?.thumbnails?.high?.url) {
      extractColors(currPlaylist[0]?.snippet?.thumbnails?.high?.url, {
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
            theme: "light",
            transition: Bounce,
          })
        );
    }
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
              background: `linear-gradient(to bottom, rgba(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue},0.3) 33%, rgba(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue},0.01) 100%)`,
            }}
            className="flex flex-col w-3/12 h-[87vh] rounded-2xl my-1 px-6"
          >
            <div className="my-6 overflow-hidden rounded-2xl aspect-video">
              {playlistOverview?.items?.length > 1 ? (
                <img
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                  src={currPlaylist[0]?.snippet?.thumbnails?.high?.url}
                  alt=""
                />
              ) : (
                <Skeleton height={"100%"} className="-top-1 rounded-2xl" />
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {currPlaylist[0]?.snippet?.localized?.title}
            </h1>
            <h3 className="mt-5 text-sm font-semibold tracking-tighter">
              {currPlaylist[0]?.snippet?.channelTitle}
            </h3>
            <div className="flex gap-2 mt-2 text-sm font-medium tracking-tighter text-zinc-400">
              <span>{currPlaylist[0]?.contentDetails?.itemCount} videos</span>•
              <span>
                {`${currPlaylist[0]?.status?.privacyStatus[0].toUpperCase()}${currPlaylist[0]?.status?.privacyStatus.slice(
                  1
                )}`}
              </span>
              •<span>{elapsedTime(date)} ago</span>
            </div>
          </div>
          <div className="z-0 flex flex-col w-9/12 gap-2 mx-2 my-1 overflow-y-auto hideScrollbar">
            {playlistOverview?.items?.length <= 1 ? (
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
                className="!min-h-[80vh] !overflow-y-auto !hideScrollbar !flex !flex-col !gap-4 !rounded-2xl !mx-2"
                increaseViewportBy={100}
                data={playlistOverview?.items}
                totalCount={playlistOverview?.pageInfo?.totalResults}
                itemContent={(index, data) => (
                  <div className="py-2">
                    <PlaylistOverviewCard
                      key={data?.id}
                      playlistItem={data}
                      index={index}
                    />
                  </div>
                )}
                endReached={() => setTimeout(() => setFetchMore(true), 500)}
                context={playlistOverview}
                components={{
                  Footer: ({ context: playlistOverview }) => {
                    return playlistOverview &&
                      playlistOverview?.items?.length <
                        playlistOverview?.pageInfo?.totalResults ? (
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
                        -----------------End of the list-----------------
                      </div>
                    );
                  },
                }}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default PlaylistOverview;
