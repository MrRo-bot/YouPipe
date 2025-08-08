import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";
import { extractColors } from "extract-colors";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addPlayItems } from "../features/playlistOverviewSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

import { elapsedTime } from "../utils/functions";
import customToastFunction from "../utils/Toastify";

import PlaylistOverviewCard from "../components/playlist/PlaylistOverviewCard";

import { PlaylistListType, TokensType } from "../types/types";

const PlaylistOverview = () => {
  const [fetchMore, setFetchMore] = useState(true);

  const { playlistId } = useParams();

  const [extractedColor, setExtractedColor] = useState("#ffffff");

  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.hamburger);
  const playlistOverview = useAppSelector((state) => state.playlistOverview);

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const playlistItem = ["contentDetails", "id", "snippet", "status"];
  const playlist = [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "status",
  ];

  useQuery({
    queryKey: ["playlistItems", fetchMore],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=${playlistItem?.join(
          ","
        )}&playlistId=${playlistId}&maxResults=50&key=${
          import.meta.env.VITE_API_KEY
        }${
          fetchMore && playlistOverview?.nextPageToken
            ? `&pageToken=${playlistOverview?.nextPageToken}`
            : ""
        }
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

  const { data: playlistInfo } = useQuery<PlaylistListType>({
    queryKey: ["playlistInfo", playlistId],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlists?part=${playlist?.join(
          ","
        )}&id=${playlistId}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const playlistInfo = await res.json();
      return playlistInfo;
    },
    enabled: !!playlistId,
  });

  useEffect(() => {
    if (playlistInfo?.items[0].snippet?.thumbnails.high.url) {
      const img = new Image();
      img.src = playlistInfo.items[0].snippet.thumbnails.high.url;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        extractColors(img)
          .then((colors) => {
            setExtractedColor(colors[0].hex);
          })
          .catch((error) =>
            customToastFunction(
              `${error instanceof Error ? error.message : error}`,
              "error"
            )
          );
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistInfo?.items[0]?.snippet?.thumbnails?.high?.url]);

  const date = new Date(
    playlistInfo?.items[0]?.snippet?.publishedAt || ""
  )?.getTime();

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <div
        className={`ml-4 mt-3 mr-2 mb-2 max-h-[90vh] rounded-2xl ${
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
            background: `linear-gradient(to bottom, ${extractedColor}30 33%, ${extractedColor}01 100%)`,
          }}
          className="flex flex-col md:flex-row lg:flex-col lg:w-3/12 lg:h-[87vh] rounded-2xl lg:my-1 px-2"
        >
          <div className="my-2 overflow-hidden lg:flex-col rounded-2xl aspect-video sm:w-[70%] sm:mx-auto lg:w-full">
            {playlistInfo ? (
              <img
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
                src={playlistInfo?.items[0]?.snippet?.thumbnails?.high?.url}
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
              {playlistInfo?.items[0]?.snippet?.title || ""}
            </h1>
            <h3 className="mt-2 text-sm font-semibold tracking-tighter lg:text-base text-zinc-200">
              {playlistInfo?.items[0]?.snippet
                ? playlistInfo?.items[0]?.snippet?.channelTitle[0]?.toUpperCase() +
                  playlistInfo?.items[0]?.snippet?.channelTitle.slice(1)
                : ""}
            </h3>
            <div className="flex gap-0.5 mt-2 text-sm md:text-base font-medium tracking-tighter text-zinc-400 md:justify-start md:gap-1 xl:gap-2">
              <span>
                {playlistInfo?.items[0]?.contentDetails?.itemCount || "..."}{" "}
                videos
              </span>
              •
              <span>
                {playlistInfo?.items[0]?.status
                  ? playlistInfo?.items[0]?.status?.privacyStatus[0].toUpperCase() +
                    playlistInfo?.items[0]?.status?.privacyStatus.slice(1)
                  : ""}
              </span>
              •<span>{elapsedTime(date)} ago</span>
            </div>
          </div>
        </motion.div>
        <div className="z-0 flex flex-col gap-2 mx-2 my-1 overflow-y-auto lg:w-9/12 hideScrollbar">
          {playlistOverview?.items?.length <= 1 ? (
            <FidgetSpinner
              visible={true}
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper mx-auto w-14 h-14 md:w-16 md:h-16 xl:w-18 xl:h-18"
            />
          ) : (
            <Virtuoso
              className="!min-h-[80vh] !overflow-y-auto !hideScrollbar !flex !flex-col !gap-4 !rounded-2xl md:!mx-2"
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
              endReached={() =>
                setTimeout(
                  () =>
                    playlistOverview?.items?.length <
                      playlistOverview?.pageInfo?.totalResults &&
                    setFetchMore(true),
                  1000
                )
              }
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
      </div>
    </SkeletonTheme>
  );
};

export default PlaylistOverview;
