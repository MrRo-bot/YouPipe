import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { PiDotsThreeOutlineVerticalFill, PiListPlus } from "react-icons/pi";

import { useAppSelector } from "../app/store";
import {
  ChannelInfoType,
  PlaylistItemListType,
  PlaylistListType,
  SearchType,
  VideoListType,
} from "../types/types";
import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../utils/functions";

const SearchCard = ({ search }: { search: SearchType }) => {
  //storing video stats from search details
  const [videoStats, setVideoStats] = useState<VideoListType>();
  //storing channel stats from search details
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  //storing playlist stats from search details
  const [playlistStats, setPlaylistStats] = useState<PlaylistListType>();
  //storing playlist items stats from playlistStats
  const [playlistItemsStats, setPlaylistItemsStats] =
    useState<PlaylistItemListType>();

  //for skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  //creating date value from ISO 8601 format
  const myDate = new Date(search?.snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.getTime();

  //getting token data from redux store
  const tokenData = useAppSelector((state) => state.token);

  //parts to be called with the API
  const parts = ["statistics", "snippet", "contentDetails"];

  //video, playlist or channel
  const kind = search?.id?.kind.split("#")[1];

  //effect for getting more details about video, channel, or playlist
  useEffect(() => {
    //if search type is video
    if (kind === "video") {
      (async () => {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?id=${
              search?.id?.videoId
            }&part=${parts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${tokenData?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Oh no! didn't get video data");
          const video = await res.json();
          if (video) setVideoStats(video);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    //if search type is channel
    if (kind === "channel") {
      (async () => {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/channels?id=${
              search?.id?.channelId
            }&part=${parts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${tokenData?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Oh no! didn't get channel data");
          const channel = await res.json();
          if (channel) setChannelStats(channel);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    //if search type is playlist
    if (kind === "playlist") {
      (async () => {
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
                Authorization: `Bearer ${tokenData?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Oh no! didn't get playlist data");
          const playlist = await res.json();
          if (playlist) setPlaylistStats(playlist);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    //if search type is playlist and need some playlist items
    if (playlistStats?.items[0]?.id) {
      (async () => {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlistItems?part=${parts
              .concat(["status"])
              .slice(1)
              .join(",")}&maxResults=2&playlistId=${
              playlistStats?.items[0]?.id
            }&key=${import.meta.env.VITE_API_KEY}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${tokenData?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Oh no! didn't get playlist items data");
          const playlistItems = await res.json();
          if (playlistItems) setPlaylistItemsStats(playlistItems);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [playlistStats?.items[0]?.id]);

  return (
    <div className="py-4">
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
          className="flex items-center justify-between gap-1 p-3 transition-all cursor-pointer hover:bg-zinc-800/70 rounded-2xl"
        >
          <div className="flex w-full">
            <div
              className={`relative overflow-hidden self-start ${
                kind === "playlist"
                  ? "min-w-[32rem] w-[32rem] rounded-2xl aspect-video"
                  : kind === "channel"
                  ? "h-40 w-[30rem]"
                  : " rounded-2xl min-w-96 w-96 aspect-video"
              } `}
            >
              {!search?.snippet?.thumbnails?.high?.url ? (
                <Skeleton height={"100%"} className="-top-1" />
              ) : (
                <>
                  <img
                    onLoad={() => setIsImgLoaded(!isImgLoaded)}
                    className={`object-cover ${
                      kind === "channel" ? "rounded-full mx-auto" : "w-full"
                    } h-full`}
                    src={search?.snippet?.thumbnails?.high?.url}
                    alt=""
                  />
                  {kind === "video" && (
                    <div
                      className={`absolute z-40 p-1 text-xs text-white bottom-1 right-1 glass-dark ${
                        videoStats?.items[0]?.contentDetails?.duration ===
                          "P0D" && "animate-pulse"
                      }`}
                    >
                      {videoStats?.items[0]?.contentDetails?.duration === "P0D"
                        ? "Live"
                        : videoDuration(
                            videoStats?.items[0]?.contentDetails?.duration ||
                              "0:00"
                          )}
                    </div>
                  )}
                  {kind === "playlist" && (
                    <div className="absolute z-40 flex items-center gap-1 p-1 text-xs text-white bottom-1 right-1 glass-dark">
                      <PiListPlus />
                      {playlistStats?.items[0]?.contentDetails?.itemCount}{" "}
                      videos
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col w-2/3 ml-3 flex-start">
              {isImgLoaded ? (
                <h3 className="w-full text-lg font-semibold text-ellipsis line-clamp-2">
                  {search?.snippet?.title || ""}
                </h3>
              ) : (
                <Skeleton
                  width={300}
                  height={27}
                  className="top-2 rounded-2xl"
                />
              )}

              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                {isImgLoaded && kind === "video" ? (
                  `${rawViewsToString(
                    videoStats?.items[0]?.statistics?.viewCount || ""
                  )} views • ${
                    elapsedTime(result) || ""
                  } ago • ${rawViewsToString(
                    videoStats?.items[0]?.statistics?.likeCount || ""
                  )} likes • ${rawViewsToString(
                    videoStats?.items[0]?.statistics?.commentCount || ""
                  )} comments`
                ) : isImgLoaded && kind === "playlist" ? (
                  `${
                    search?.snippet?.channelTitle
                  } • Playlist • Created ${elapsedTime(result)} ago`
                ) : isImgLoaded && kind === "channel" ? (
                  `${
                    channelStats?.items
                      ? channelStats?.items[0]?.snippet?.customUrl
                      : ""
                  } • ${
                    channelStats?.items
                      ? rawViewsToString(
                          channelStats?.items[0]?.statistics?.subscriberCount ||
                            ""
                        )
                      : "unknown"
                  } subscribers • ${
                    channelStats?.items
                      ? rawViewsToString(
                          channelStats?.items[0]?.statistics?.viewCount || ""
                        )
                      : "unknown"
                  } views • ${
                    channelStats?.items
                      ? rawViewsToString(
                          channelStats?.items[0]?.statistics?.videoCount || ""
                        )
                      : "unknown"
                  } videos`
                ) : (
                  <Skeleton
                    width={150}
                    height={20}
                    className="top-5 rounded-2xl"
                  />
                )}
              </div>

              {kind === "video" && isImgLoaded && (
                <div className="py-3 tracking-wide text-zinc-300 text-ellipsis">
                  {search?.snippet?.channelTitle}
                </div>
              )}
              {kind === "video" && !isImgLoaded && (
                <Skeleton width={100} className="rounded-2xl" />
              )}

              <div
                className={`w-full my-2 text-sm ${
                  kind !== "playlist" && "my-3 text-ellipsis line-clamp-2"
                } text-zinc-400`}
              >
                {(isImgLoaded && kind === "video") || kind === "channel" ? (
                  search?.snippet?.description
                ) : isImgLoaded && kind === "playlist" ? (
                  <>
                    {!playlistItemsStats?.items ? (
                      <Skeleton
                        count={2}
                        height={20}
                        width={80 + "%"}
                        className="my-1"
                      />
                    ) : (
                      playlistItemsStats?.items?.map((item) => (
                        <div className="flex justify-start my-1" key={item?.id}>
                          <div className="w-4/6 text-ellipsis line-clamp-1">
                            {`${item?.snippet?.title}`}
                          </div>
                          <div className="w-2/6">
                            {` • ${item?.snippet?.videoOwnerChannelTitle}`}
                          </div>
                        </div>
                      ))
                    )}
                  </>
                ) : (
                  <Skeleton
                    width={150}
                    height={20}
                    className="top-5 rounded-2xl"
                  />
                )}
              </div>
              {kind === "playlist" && <div>View full playlist</div>}
            </div>

            {kind === "channel" ? (
              <div className="self-center px-2 py-1 m-1 font-medium rounded-full cursor-pointer bg-zinc-800">
                Subscribed
              </div>
            ) : (
              <PiDotsThreeOutlineVerticalFill className="items-end self-center cursor-pointer w-7 h-7 text-zinc-200" />
            )}
          </div>
        </motion.div>
      </SkeletonTheme>
    </div>
  );
};

export default SearchCard;
