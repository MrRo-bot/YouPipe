import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";

import PlaylistOverviewCard from "../components/playlist/PlaylistOverviewCard";
import { useAppDispatch, useAppSelector } from "../app/store";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { addPlayItems } from "../features/playlistOverviewSlice";
import { elapsedTime } from "../utils/functions";
import { PlaylistItemListType, TokensType } from "../types/types";

//footer shows loading or end of list
const Footer = ({
  context: playlistOverview,
}: {
  context: PlaylistItemListType;
}) => {
  return playlistOverview?.items?.length <
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
    <div className="mx-auto text-lg italic font-bold w-max">End</div>
  );
};

const PlaylistOverview = () => {
  //triggers query for fetching more data
  const [fetchMore, setFetchMore] = useState(true);

  //for skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  //redux store dispatch
  const dispatch = useAppDispatch();

  //sidebar
  const isOpen = useAppSelector((state) => state.hamburger);
  //playlist overview
  const playlistOverview = useAppSelector((state) => state.playlistOverview);

  //getting route parameter
  const { playlistId } = useParams();

  //playlist store
  //filter out the playlist details from playlistId
  const currPlaylist = useAppSelector((state) =>
    state.playlist.items.filter((list) => list.id === playlistId)
  );

  //creating date value from ISO 8601 format
  const myDate = new Date(currPlaylist[0].snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  //getting token from localStorage
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
          <div className="flex flex-col w-3/12 h-[87vh] rounded-2xl my-1 px-6">
            <div className="my-6 overflow-hidden rounded-2xl aspect-video">
              {playlistOverview?.items?.length > 1 ? (
                <img
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
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
              <span>{currPlaylist[0]?.contentDetails?.itemCount} videos</span>
              <span>
                {`${currPlaylist[0]?.status?.privacyStatus[0].toUpperCase()}${currPlaylist[0]?.status?.privacyStatus.slice(
                  1
                )}`}
              </span>
              <span>{elapsedTime(result)} ago</span>
            </div>
          </div>
          <div className="z-0 flex flex-col w-9/12 gap-2 mx-2 my-1 overflow-y-auto hideScrollbar">
            {/* Virtuoso virtualized rendering of playlistItems list for increased rendering performance */}
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
                itemContent={(_, data) => (
                  <div className="py-2">
                    <PlaylistOverviewCard key={data?.id} playlistItem={data} />
                  </div>
                )}
                endReached={() => setTimeout(() => setFetchMore(true), 500)}
                context={playlistOverview}
                components={{ Footer }}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default PlaylistOverview;
