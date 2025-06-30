import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";
import ReactPlayer from "react-player/youtube";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parse from "html-react-parser";

import {
  PiThumbsDownBold,
  PiThumbsDownFill,
  PiThumbsUpBold,
  PiThumbsUpFill,
} from "react-icons/pi";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addComment, addCommentsThread } from "../features/commentsThreadSlice";
import { addLikedVideo, removeLikedVideo } from "../features/likedVideosSlice";
import { addTimestamp } from "../features/timestampSlice";
import { addSearchString, refetch } from "../features/searchSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

import Comments from "../components/comments/Comments";

import { rawViewsToString } from "../utils/functions";

import { RatingType, TokensType, VideosListType } from "../types/types";

const Player = () => {
  const [myComment, setMyComment] = useState("");
  const [fetchMore, setFetchMore] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState<RatingType>({
    kind: "",
    etag: "",
    items: [
      {
        videoId: "",
        rating: "",
      },
    ],
  });
  const [sub, setSub] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const playerRef = useRef(null);

  const { videoId } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const timestamp = useAppSelector((state) => state.timestamp.value);
  const comments = useAppSelector((state) => state.commentsThread);

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

  const { data: video } = useQuery<VideosListType>({
    queryKey: ["playingVideo", videoId],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=${parts.join(
          ","
        )}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const video = await res.json();
      return video;
    },
    enabled: !!videoId,
  });

  const date = new Date(
    video?.items[0]?.snippet?.publishedAt || ""
  ).toLocaleDateString();

  //fetching video author data
  const { data: channelProfile, isLoading: isChannelProfLoading } = useQuery({
    queryKey: ["channelProfile", video?.items[0]?.snippet?.channelId],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${
          video?.items[0]?.snippet?.channelId
        }&part=snippet,statistics&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const channelStats = await res.json();
      return channelStats;
    },
    enabled: !!video?.items[0]?.snippet?.channelId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { status, data, isLoading } = useQuery({
    queryKey: ["playingVideoComments", videoId, fetchMore],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=id%2Creplies%2Csnippet&videoId=${videoId}&maxResults=100&textFormat=html&key=${
          import.meta.env.VITE_API_KEY
        }&pageToken=${fetchMore ? comments?.nextPageToken : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const commentThread = await res.json();
      dispatch(addCommentsThread(commentThread));
      setFetchMore(false);
      return commentThread;
    },
    enabled: !!videoId && !!fetchMore,
  });

  //modifying description by detecting links and adding styles to it
  const linkRegex =
    /(?:(https?:\/\/)|(?:www\.))[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]/gi;
  //finding timestamps in description
  const timestampRegex = /\b(?=[0-5]?\d)(?:[0-5]?\d)(?::[0-5]?\d){1,2}\b/gm;

  const replacer = (match: string) => {
    // Remove http:// or https:// if present, otherwise return match unchanged
    return match.replace(/^https?:\/\//, "");
  };

  const findingLinks = video?.items[0]?.snippet?.localized?.description.replace(
    linkRegex,
    (match: string) => {
      const url = replacer(match);
      // Basic sanitization to prevent XSS (use a library like DOMPurify in production)
      const sanitizedUrl = url.replace(/javascript:/gi, "");
      const sanitizedMatch = match.replace(/javascript:/gi, "");
      return `<a className="rounded-full px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors" href="//${sanitizedUrl}" target="_blank" rel="noopener noreferrer">${sanitizedMatch}</a>`;
    }
  );

  const handleTimestamp = (e: { currentTarget: { innerText: string } }) => {
    const timestampArr = e.currentTarget.innerText.split(":");
    let seconds = 0;

    //if hours exists in timestamp
    // h * 3600 + m * 60 + s
    seconds =
      timestampArr.length > 2
        ? Number(timestampArr[0]) * 3600 +
          Number(timestampArr[1]) * 60 +
          Number(timestampArr[2])
        : Number(timestampArr[0]) * 60 + Number(timestampArr[1]);

    dispatch(addTimestamp(seconds));
  };

  const modifiedDescription = findingLinks?.replace(
    timestampRegex,
    (match) =>
      `<code className="cursor-pointer rounded-md px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors">${match}</code>`
  );

  //attaching handleTimestamp function in code tags inside the paragraph that contains timestamps
  useEffect(() => {
    const codeElement = containerRef?.current?.querySelectorAll("code");
    //@ts-expect-error too much type overload
    const codeElementArray = Array?.from(codeElement);
    codeElementArray.map((x) => {
      //@ts-expect-error too much type overload
      x?.addEventListener("click", handleTimestamp);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //seeking to a timestamp
  useEffect(() => {
    if (timestamp !== 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      playerRef.current?.seekTo(timestamp, "seconds");
      setIsPlaying(true);
    }
  }, [timestamp]);

  useQuery({
    queryKey: ["rating"],
    queryFn: async () => {
      if (videoId) {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos/getRating?id=${videoId}&key=${
            import.meta.env.VITE_API_KEY
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        const ratings = await res.json();
        setRating(ratings);
        return ratings;
      }
    },
  });

  const handleRating = (e: { currentTarget: { id: string } }) => {
    const rate = rating.items[0].rating;
    const ratingPostFunc = async (r: string) => {
      return await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=${r}&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
    };

    if (e.currentTarget.id === "like") {
      if (rate === "like") {
        ratingPostFunc("none");
        dispatch(removeLikedVideo(video?.items[0]));
        setRating((prev) => ({
          ...prev,
          items: [{ videoId: prev.items[0].videoId, rating: "none" }],
        }));
      } else {
        dispatch(addLikedVideo(video?.items[0]));
        ratingPostFunc("like");
        setRating((prev) => ({
          ...prev,
          items: [{ videoId: prev.items[0].videoId, rating: "like" }],
        }));
        toast("💖 LIKEd!", {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          className: "!toastGradient !font-bold !text-zinc-50",
          transition: Bounce,
        });
      }
    }
    if (e.currentTarget.id === "dislike") {
      if (rate === "dislike") {
        ratingPostFunc("none");
        setRating((prev) => ({
          ...prev,
          items: [{ videoId: prev.items[0].videoId, rating: "none" }],
        }));
      } else {
        dispatch(removeLikedVideo(video?.items[0]));
        ratingPostFunc("dislike");
        setRating((prev) => ({
          ...prev,
          items: [{ videoId: prev.items[0].videoId, rating: "dislike" }],
        }));
        toast("💔 DISLIKEd!", {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          className: "!toastGradient !font-bold !text-zinc-50",
          transition: Bounce,
        });
      }
    }
  };

  const comMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=id%2Creplies%2Csnippet&key=${
          import.meta.env.VITE_API_KEY
        }`,

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
          body: JSON.stringify({
            snippet: {
              videoId: id,
              topLevelComment: { snippet: { textOriginal: myComment } },
            },
          }),
        }
      );
      if (!res.ok) throw new Error("Error adding comment");
      const comment = await res.json();
      dispatch(addComment(comment));
    },
    onSuccess: () => {
      setMyComment("");
      toast("💬 Comment added!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      });
    },
    onError: (e) => {
      toast.error(`🤔 ${e}`, {
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
    },
  });

  const { isLoading: subLoading, data: isSubData } = useQuery({
    queryKey: ["videoChannelSubCheck", video?.items[0]?.snippet?.channelId],
    queryFn: async () => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${
          video?.items[0]?.snippet?.channelId
        }&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const isSubscribed = await res.json();
      setSub(isSubscribed.pageInfo.totalResults ? true : false);
      return isSubscribed;
    },
    enabled: !!video?.items[0]?.snippet?.channelId,
  });

  const subDelMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${id}&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error removing subscriber");
    },
    onSuccess: async () => {
      toast("🥲 Unsubscribed!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      });
    },
    onError: (e) => {
      toast.error(`🤔 ${e.message}`, {
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
    },
  });

  const subAddMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
          body: JSON.stringify({
            snippet: {
              resourceId: {
                kind: channelProfile?.items[0]?.kind,
                channelId: channelProfile?.items[0]?.id,
              },
            },
          }),
        }
      );
      if (!res.ok) throw new Error("Error subscribing to user");
    },
    onSuccess: async () => {
      toast("🥳 Subscribed", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      });
    },
    onError: (e) => {
      toast.error(`🤔 ${e.message}`, {
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
    },
  });

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <div className="w-full h-[90vh] pt-5">
        <div className="flex w-[97%] h-full mx-auto">
          <div className="w-[75%] overflow-y-scroll hideScrollbar">
            <div className="relative">
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full h-[70vh] overflow-hidden aspect-video rounded-3xl"
              >
                <ReactPlayer
                  ref={playerRef}
                  url={`https://www.youtube.com/watch?v=${videoId}`} //[] url array for playlist playback (create list of links from playlist first)
                  playing={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  controls={true}
                  volume={0.1}
                  playbackRate={1}
                  pip={true}
                  width={100 + "%"}
                  height={100 + "%"}
                />
              </motion.div>

              <div className="absolute w-full px-3 py-2 mt-2 -translate-x-1/2 rounded-3xl glass left-1/2 ">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut", delay: 0.1 }}
                  className="flex items-center justify-between gap-2 px-2 py-1 transition-colors rounded-3xl glass-dark hover:bg-indigo-600/20 focus:bg-indigo-600/20"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center justify-between gap-2">
                      {isChannelProfLoading ? (
                        <>
                          <Skeleton className="!rounded-3xl !w-10 !h-10 -top-0.5" />
                          <Skeleton count={2} className="!w-32  rounded-3xl" />
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() =>
                              navigate(
                                `/channel/${channelProfile?.items[0]?.id}`
                              )
                            }
                            className="grid place-items-center relative rounded-3xl size-10 overflow-hidden transition-shadow cursor-pointer mx-auto shadow-[0_0_0_2px_rgb(250_204_21)] hover:shadow-[0_0_0_3px_rgb(250_204_50)] focus:shadow-[0_0_0_3px_rgb(250_204_50)]"
                          >
                            <img
                              referrerPolicy="no-referrer"
                              className="rounded-3xl"
                              src={
                                channelProfile?.items[0]?.snippet?.thumbnails
                                  ?.default?.url
                              }
                            />
                          </div>
                          <div>
                            <div
                              className="text-xl font-bold cursor-pointer text-zinc-50"
                              onClick={() =>
                                navigate(
                                  `/channel/${channelProfile?.items[0]?.id}`
                                )
                              }
                            >
                              {channelProfile?.items[0]?.snippet?.title}
                            </div>
                            <div className="text-sm font-medium text-zinc-400">
                              {rawViewsToString(
                                channelProfile?.items[0]?.statistics
                                  ?.subscriberCount || ""
                              )}{" "}
                              subscribers
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {subLoading ? (
                      <Skeleton className="px-3 py-2 !rounded-3xl !w-24" />
                    ) : (
                      <AnimatePresence>
                        <div
                          onClick={(e) => (e.stopPropagation(), setSub(!sub))}
                          className={`grid place-items-center overflow-hidden px-3 py-1.5 w-max font-medium transition-colors rounded-full cursor-pointer select-none ${
                            sub
                              ? "bg-zinc-800 hover:bg-zinc-600/70 focus:bg-zinc-600/70 active:bg-zinc-600/70 "
                              : "bg-white text-black hover:bg-zinc-200/70 focus:bg-zinc-200/70 active:bg-zinc-200/70"
                          } `}
                        >
                          {sub ? (
                            <motion.span
                              key="subscribed"
                              initial={{ opacity: 0, x: -100, rotate: -45 }}
                              animate={{ opacity: 1, x: 0, rotate: 0 }}
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              onClick={() =>
                                isSubData?.pageInfo?.totalResults &&
                                subDelMutation.mutate(isSubData?.items[0]?.id)
                              }
                            >
                              Subscribed
                            </motion.span>
                          ) : (
                            <motion.span
                              key="subscribe"
                              initial={{ opacity: 0, y: -100 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              onClick={() => {
                                subAddMutation.mutate();
                              }}
                            >
                              Subscribe
                            </motion.span>
                          )}
                        </div>
                      </AnimatePresence>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-zinc-50">
                      <strong className="text-violet-200">
                        {rawViewsToString(
                          video?.items[0]?.statistics?.viewCount || "0"
                        )}
                      </strong>{" "}
                      views
                    </div>
                    |
                    <div className="flex items-center gap-2 text-zinc-50">
                      <div
                        id="like"
                        onClick={handleRating}
                        className={`relative flex items-center gap-1 cursor-pointer rounded-3xl hover:bg-zinc-200/10 focus:bg-zinc-200/10 active:bg-zinc-200/10 px-2 py-0.5 max-w-max ${
                          rating.items[0].rating === "like" && "text-yellow-400"
                        }
                    `}
                      >
                        <AnimatePresence>
                          {rating.items[0].rating === "like" && (
                            <motion.div
                              className="absolute z-50 pointer-events-none"
                              animate={{
                                scale: [1, 2, 4, 6, 8],
                                rotate: [0, -20, -40, -10, 0],
                                opacity: [0.25, 0.5, 1, 0.75, 0],
                                y: [0, -20, -40, -60, -80],
                              }}
                              transition={{
                                duration: 1,
                                ease: "linear",
                                times: [0, 0.25, 0.5, 0.75, 1],
                              }}
                            >
                              <span className="text-4xl">👍</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {rating.items[0].rating === "like" ? (
                          <PiThumbsUpFill className="pointer-events-none" />
                        ) : (
                          <PiThumbsUpBold className="pointer-events-none" />
                        )}
                        <strong
                          className={`text-violet-200 ${
                            rating.items[0].rating === "like" &&
                            "text-yellow-400"
                          }`}
                        >
                          {rawViewsToString(
                            video?.items[0]?.statistics?.likeCount || "0"
                          )}
                        </strong>
                      </div>
                      •
                      <div
                        id="dislike"
                        onClick={handleRating}
                        className={`cursor-pointer rounded-3xl hover:bg-zinc-200/10 focus:bg-zinc-200/10 active:bg-zinc-200/10 px-2 py-0.5 max-w-max ${
                          rating.items[0].rating === "dislike" &&
                          "text-yellow-400"
                        }`}
                      >
                        <AnimatePresence>
                          {rating.items[0].rating === "dislike" && (
                            <motion.div
                              className="absolute z-50 pointer-events-none"
                              animate={{
                                scale: [1, 2, 4, 6, 8],
                                rotate: [0, -20, -40, -10, 0],
                                opacity: [0.25, 0.5, 1, 0.75, 0],
                                y: [0, -20, -40, -60, -80],
                              }}
                              transition={{
                                duration: 1,
                                ease: "linear",
                                times: [0, 0.25, 0.5, 0.75, 1],
                              }}
                            >
                              <span className="text-4xl">👎</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {rating.items[0].rating === "dislike" ? (
                          <PiThumbsDownFill />
                        ) : (
                          <PiThumbsDownBold />
                        )}
                      </div>
                    </div>
                    |
                    <div className="flex items-center gap-2 text-zinc-50">
                      <strong className="text-violet-200">{date}</strong>
                    </div>
                  </div>
                </motion.div>
                <motion.pre
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut", delay: 0.2 }}
                  className="p-2 mt-2 text-purple-100 transition-colors rounded-3xl text-wrap glass-dark hover:bg-indigo-600/20 focus:bg-indigo-600/20"
                >
                  <span ref={containerRef}>
                    {parse(modifiedDescription || "No Description Found")}
                  </span>
                  <br />
                  <br />
                  <div className="flex flex-wrap gap-2">
                    {video?.items[0]?.snippet?.tags?.map((tag: string) => (
                      <>
                        <span
                          onClick={() => {
                            dispatch(addSearchString(tag.split(" ").join("_")));
                            navigate("/search");
                            dispatch(refetch(true));
                          }}
                          key={tag}
                          className="px-2 py-1 font-bold transition-colors rounded-3xl bg-slate-500 cursor-crosshair text-slate-950 hover:bg-indigo-600/20 focus:bg-indigo-600/20 active:bg-zinc-300/20 hover:text-zinc-50 focus:text-zinc-50 active:text-zinc-50"
                        >
                          #{tag.split(" ").join("_")}
                        </span>{" "}
                      </>
                    ))}
                  </div>
                </motion.pre>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-[25%] text-center ml-5 h-full flex flex-col gap-3 overflow-y-scroll hideScrollbar"
          >
            <h2 className="py-1 text-2xl text-zinc-50">
              <strong>
                {rawViewsToString(
                  video?.items[0]?.statistics?.commentCount || "0"
                )}
              </strong>{" "}
              Comments
            </h2>

            <div className="relative w-full">
              <div className="overflow-y-hidden min-h-12 whitespace-pre-wrap break-words w-full invisible leading-[24px]">
                {myComment}
              </div>{" "}
              <textarea
                className="hideScrollbar absolute p-2 py-3 text-zinc-100  bg-transparent focus:bg-slate-700/50 right-0 top-0 bottom-0 left-0 resize-none leading-[24px] border-b-2 border-b-slate-500 focus:border-b-white ring-0 border-0 outline-none"
                value={myComment}
                placeholder="Describe your vibe 📝"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMyComment(e.target.value)
                }
              />
            </div>
            <div className="flex gap-6 mx-auto">
              <button
                onClick={() => setMyComment("")}
                className="px-3 py-2 transition-colors duration-300 ease-in-out rounded-full cursor-pointer delay-50 hover:bg-gray-500/50"
              >
                Cancel
              </button>
              <button
                onClick={() => comMutation.mutate(videoId)}
                className={`transition-colors duration-300 ease-in-out delay-50 px-3 py-2 rounded-full cursor-pointer bg-gray-500/50 hover:bg-pink-400 ${
                  myComment.length > 0 && "bg-pink-500"
                }`}
              >
                Comment
              </button>
            </div>
            {status === "pending" && isLoading && (
              <FidgetSpinner
                visible={true}
                height="80"
                width="80"
                ariaLabel="fidget-spinner-loading"
                wrapperStyle={{}}
                wrapperClass="fidget-spinner-wrapper mx-auto"
              />
            )}
            {!isLoading && comments?.items?.length > 1 && (
              <Virtuoso
                className="hideScrollbar"
                increaseViewportBy={100}
                data={comments?.items}
                totalCount={Number(
                  video?.items[0]?.statistics?.commentCount || 0
                )}
                itemContent={(_, data) => (
                  <div className="pt-3">
                    <Comments
                      key={data?.etag}
                      comment={data}
                      channelId={video?.items[0]?.snippet?.channelId || ""}
                    />
                  </div>
                )}
                endReached={() => setTimeout(() => setFetchMore(true), 1000)}
                context={{ comments: comments, video: video }}
                components={{
                  Footer: ({ context }) => {
                    return context &&
                      context?.comments?.items?.length <
                        Number(
                          context?.video?.items[0]?.statistics?.commentCount
                        ) ? (
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
            {status === "error" && !data && (
              <span className="flex flex-col py-1 my-auto text-2xl transition-colors text-zinc-50 glass hover:bg-indigo-600/20 focus:bg-indigo-600/20">
                OH NO!
                <span className="text-4xl">😿</span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-500">
                  comments are disabled
                </span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-500">
                  so do comment box
                </span>
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default Player;
