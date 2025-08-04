import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { VirtuosoGrid } from "react-virtuoso";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { PiClosedCaptioningFill } from "react-icons/pi";
import { FcClock, FcStart } from "react-icons/fc";

import { useAppDispatch, useAppSelector } from "../../app/store";
import { addChannelUploads } from "../../features/channelOverviewSlice";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import {
  elapsedTime,
  rawViewsToString,
  videoDuration,
} from "../../utils/functions";

import {
  PlaylistItemType,
  TokensType,
  VideosListType,
} from "../../types/types";

const UploadCards = ({
  videoItem,
  uniqueKey,
}: {
  videoItem: PlaylistItemType;
  uniqueKey: string;
}) => {
  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const videoParts = ["statistics", "snippet", "contentDetails"];

  const { isLoading, data: video } = useQuery<VideosListType>({
    queryKey: ["uploadsVideoStat", videoItem?.contentDetails?.videoId],
    queryFn: async () => {
      const videoRes = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${
          videoItem?.contentDetails?.videoId
        }&part=${videoParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const video = await videoRes.json();
      return video;
    },
    enabled: !!videoItem?.contentDetails?.videoId,
  });

  const date = new Date(video?.items[0]?.snippet?.publishedAt || "").getTime();

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <motion.div
        key={uniqueKey}
        variants={{
          hidden: { scale: 0.95 },
          visible: { scale: 1 },
        }}
        initial={"hidden"}
        whileInView={"visible"}
        className={`z-0 my-1 flex flex-col justify-between h-full mx-auto gap-1 p-1 cursor-pointer group max-w-96 active:bg-zinc-600/70 glass rounded-2xl transition-colors hover:bg-indigo-600/20 focus:bg-indigo-600/20`}
        onClick={() => navigate(`/video/${video?.items[0]?.id}`)}
      >
        <div className="flex flex-col gap-2">
          <div className="relative overflow-hidden aspect-video rounded-2xl">
            {isLoading ? (
              <Skeleton
                width={"100%"}
                height={"100%"}
                className="-top-1 rounded-2xl"
              />
            ) : (
              <>
                <img
                  referrerPolicy="no-referrer"
                  src={video?.items[0]?.snippet?.thumbnails?.high?.url || ""}
                  alt=""
                  className="object-cover w-full h-full transition-transform rounded-2xl group-hover:scale-110 group-focus:scale-110"
                />
                {video?.items[0]?.contentDetails?.caption === "true" && (
                  <div className="absolute z-50 text-xs px-0.5 text-white rounded-none bottom-1 left-1 glass-dark">
                    <PiClosedCaptioningFill className="size-5" />
                  </div>
                )}
                <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                  {videoDuration(
                    video?.items[0]?.contentDetails?.duration || "00:0"
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 px-1">
            {isLoading ? (
              <Skeleton width={200} className="rounded-2xl" />
            ) : (
              <div className="flex items-start justify-between">
                <div className="w-10/12 text-ellipsis line-clamp-2 text-zinc-50">
                  {video?.items[0]?.snippet?.localized?.title || ""}
                </div>
              </div>
            )}
            <div className="flex justify-start gap-2">
              <div className="flex items-center">
                <FcStart className="size-4 mr-0.5" />
                {isLoading ? (
                  <Skeleton width={100} className="rounded-2xl" />
                ) : (
                  <div className="text-xs tracking-tighter text-zinc-400">
                    {`${rawViewsToString(
                      video?.items[0]?.statistics?.viewCount || ""
                    )} views`}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <FcClock color="black" className="size-4 mr-0.5" />
                {isLoading ? (
                  <Skeleton width={100} className="rounded-2xl" />
                ) : (
                  <div className="text-xs tracking-tight text-zinc-400">
                    {elapsedTime(date)} ago
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

const Uploads = () => {
  const [fetchMore, setFetchMore] = useState(true);

  const dispatch = useAppDispatch();

  const channelDetails = useAppSelector(
    (state) => state.channelOverview.channelDetails
  );
  const channelUploads = useAppSelector(
    (state) => state.channelOverview.channelUploads
  );

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const channelUploadParts = ["contentDetails", "id", "snippet", "status"];

  useQuery({
    queryKey: [
      "channelUploads",
      channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads,
      fetchMore,
    ],
    queryFn: () => {
      setTimeout(async () => {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/playlistItems?part=${channelUploadParts.join(
            ","
          )}&maxResults=12&playlistId=${
            channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads
          }&key=${import.meta.env.VITE_API_KEY}&pageToken=${
            fetchMore ? channelUploads?.nextPageToken : ""
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
        const channelVideos = await res.json();
        dispatch(addChannelUploads(channelVideos));
        setFetchMore(false);
        return channelVideos;
      }, 1000);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled:
      !!channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads &&
      !!fetchMore,
  });

  return (
    <>
      {channelUploads?.items?.length <= 1 ? (
        <div className="w-full">
          <FidgetSpinner
            visible={true}
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper mx-auto w-14 h-14 md:w-16 md:h-16 xl:w-18 xl:h-18"
          />
        </div>
      ) : (
        <VirtuosoGrid
          className="w-full !min-h-[70vh] lg:!min-h-[50vh] max-h-full !hideScrollbar"
          listClassName="grid grid-flow-row gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data={channelUploads?.items}
          totalCount={channelUploads?.pageInfo?.totalResults || 0}
          endReached={() => setTimeout(() => setFetchMore(true), 1000)}
          context={channelUploads}
          components={{
            Footer: ({ context: channelUploads }) => {
              const total = channelUploads?.pageInfo?.totalResults || 0;
              return channelUploads && channelUploads?.items?.length < total ? (
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="#3bf6fcbf"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass="justify-center py-1"
                />
              ) : (
                <div className="py-1 mx-auto text-lg italic font-bold w-max">
                  That's All
                </div>
              );
            },
          }}
          itemContent={(_, playlistItem) => (
            <UploadCards
              uniqueKey={playlistItem?.id}
              videoItem={playlistItem}
            />
          )}
        />
      )}
    </>
  );
};

export default Uploads;
