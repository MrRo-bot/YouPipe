import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { PiListPlus, PiUserFill } from "react-icons/pi";

import { usePersistedState } from "../../hooks/usePersistentStorage";
import { elapsedTime } from "../../utils/functions";
import customToastFunction from "../../utils/Toastify";

import {
  PlaylistItemListType,
  PlaylistListType,
  SearchType,
  TokensType,
} from "../../types/types";

const Playlist = ({ search, kind }: { search: SearchType; kind: string }) => {
  const [playlist, setPlaylist] = useState<{
    playlistStats: PlaylistListType;
    statsLoading: boolean;
    playlistItemsStats: PlaylistItemListType;
    itemsLoading: boolean;
  }>({
    playlistStats: {
      kind: "",
      etag: "",
      nextPageToken: "",
      prevPageToken: "",
      pageInfo: {
        totalResults: 0,
        resultsPerPage: 0,
      },
      //@ts-expect-error not defined items default state
      items: [],
    },
    statsLoading: true,
    playlistItemsStats: {
      kind: "",
      etag: "",
      nextPageToken: "",
      prevPageToken: "",
      pageInfo: {
        totalResults: 0,
        resultsPerPage: 0,
      },
      //@ts-expect-error not defined items default state
      items: [],
    },
    itemsLoading: true,
  });

  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const parts = ["statistics", "snippet", "contentDetails"];
  useEffect(() => {
    (async () => {
      if (kind === "playlist") {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlists?id=${
              search?.id?.playlistId
            }&part=${parts.concat(["status"]).slice(1).join(",")}&key=${
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
          if (!res.ok && res.status >= 400)
            throw new Error(`Error ${res.status} in getting playlist data`);
          const playlist = await res.json();
          setPlaylist((prev) => ({
            ...prev,
            playlistStats: playlist,
            statsLoading: false,
          }));
        } catch (error) {
          setPlaylist((prev) => ({
            ...prev,
            statsLoading: true,
          }));
          customToastFunction(
            `${error instanceof Error ? error.message : error}`,
            "error"
          );
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.id?.playlistId]);

  useEffect(() => {
    (async () => {
      if (playlist?.playlistStats?.items[0]?.id) {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlistItems?part=${parts
              .concat(["status"])
              .slice(1)
              .join(",")}&maxResults=2&playlistId=${
              playlist?.playlistStats?.items[0]?.id
            }&key=${import.meta.env.VITE_API_KEY}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${token?.access_token}`,
              },
            }
          );
          if (!res.ok && res.status >= 400)
            throw new Error(
              `Error ${res.status} in getting playlist items data`
            );
          const playlistItems = await res.json();
          setPlaylist((prev) => ({
            ...prev,
            playlistItemsStats: playlistItems,
            itemsLoading: false,
          }));
        } catch (error) {
          setPlaylist((prev) => ({
            ...prev,
            itemsLoading: true,
          }));
          customToastFunction(
            `${error instanceof Error ? error.message : error}`,
            "error"
          );
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.playlistStats?.items[0]?.id]);

  const date = new Date(
    playlist?.playlistStats?.items[0]?.snippet?.publishedAt || ""
  ).getTime();
  return (
    <div
      className="py-4 "
      onClick={() =>
        navigate(`/playlist/${playlist?.playlistStats?.items[0]?.id}`)
      }
    >
      <SkeletonTheme
        baseColor="rgba(255,255,255,0.1)"
        customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
      >
        <motion.div
          variants={{
            hidden: { scale: 0.95 },
            visible: { scale: 1 },
          }}
          initial={"hidden"}
          whileInView={"visible"}
          className="flex items-center justify-between gap-1 p-3 transition-colors cursor-pointer hover:bg-indigo-600/20 focus:bg-indigo-600/20 rounded-2xl"
        >
          <div className="flex flex-col w-full sm:flex-row">
            <div className="relative self-start overflow-hidden min-w-40 sm:max-w-64 md:max-w-72 lg:max-w-min-w-80 xl:max-w-96 rounded-2xl aspect-video">
              {playlist?.statsLoading ? (
                <Skeleton className="absolute inset-0 min-w-40 sm:min-w-64 md:min-w-72 lg:min-w-min-w-80 xl:min-w-96 aspect-video -top-1" />
              ) : (
                <>
                  <img
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                    src={
                      playlist?.playlistStats?.items[0]?.snippet?.thumbnails
                        ?.high?.url
                    }
                    alt=""
                  />

                  <div className="absolute z-40 flex items-center gap-1 p-1 text-xs text-white bottom-1 right-1 glass-dark">
                    <PiListPlus />
                    {
                      playlist?.playlistStats?.items[0]?.contentDetails
                        ?.itemCount
                    }{" "}
                    videos
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:w-2/3 sm:ml-3 flex-start">
              {playlist?.statsLoading ? (
                <Skeleton width={300} height={27} className="rounded-2xl" />
              ) : (
                <h3 className="w-full text-lg font-semibold text-ellipsis line-clamp-2 text-zinc-50">
                  {playlist?.playlistStats?.items[0]?.snippet?.title || ""}
                </h3>
              )}

              {playlist?.statsLoading ? (
                <Skeleton width={150} height={20} className="rounded-2xl" />
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  {
                    <span
                      className="flex items-center gap-1 transition-colors hover:text-slate-500 focus:text-slate-500 text-zinc-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/channel/${playlist?.playlistStats?.items[0]?.snippet?.channelId}`
                        );
                      }}
                    >
                      <PiUserFill className="text-yellow-200" />{" "}
                      {playlist?.playlistStats?.items[0]?.snippet?.channelTitle}
                    </span>
                  }
                  • Playlist • Created {elapsedTime(date)} ago
                </div>
              )}

              {playlist?.statsLoading ? (
                <Skeleton width={150} height={20} className="rounded-2xl" />
              ) : playlist?.itemsLoading ? (
                <Skeleton count={2} height={10} width={24} className="my-1" />
              ) : (
                <div className="flex flex-col gap-1 mt-2">
                  {playlist?.playlistItemsStats?.items?.map((item) => (
                    <div
                      onClick={() => navigate(`/video/${item?.id}`)}
                      className="w-full text-sm text-zinc-400"
                    >
                      <div
                        className="flex justify-start my-0.5"
                        key={item?.etag}
                      >
                        <div className="min-w-[75%] text-ellipsis line-clamp-1">
                          {`${item?.snippet?.title}`}
                        </div>
                        <div className="min-w-[25%] text-ellipsis line-clamp-1">
                          {` • ${item?.snippet?.videoOwnerChannelTitle}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </SkeletonTheme>
    </div>
  );
};

export default Playlist;
