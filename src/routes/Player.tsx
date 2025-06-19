import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";
import ReactPlayer from "react-player/youtube";
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
import { addSearchString } from "../features/searchSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { rawViewsToString } from "../utils/functions";
import Comments from "../components/comments/Comments";
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

  const { videoId } = useParams();
  const navigate = useNavigate();

  const playerRef = useRef(null);

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

  useQuery({
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const handleTimestamp = (e) => {
    const timestampArr = e.target.innerText.split(":");
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

  //handling timestamp
  const modifiedDescription = findingLinks?.replace(
    /(\d*:?\d{1,2}:\d{1,2})/gm,
    (match) =>
      `<code className="cursor-pointer rounded-md px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors">${match}</code>`
  );

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
      }
    }
  };

  const comMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      const response = await fetch(
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
      const comment = await response.json();
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

  return (
    <div className="w-full h-[90vh] pt-5">
      <div className="flex w-[97%] h-full mx-auto">
        <div className="w-[75%] overflow-y-scroll hideScrollbar">
          <div className="relative">
            <div className="w-full h-full overflow-hidden aspect-video rounded-3xl">
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
            </div>

            <div className="absolute w-full px-3 py-2 mt-2 -translate-x-1/2 rounded-3xl glass left-1/2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-3xl glass-dark w-max ">
                <div className="flex items-center gap-2">
                  <strong className="text-violet-200">
                    {rawViewsToString(
                      video?.items[0]?.statistics?.viewCount || "0"
                    )}
                  </strong>{" "}
                  views
                </div>
                |
                <div className="flex items-center gap-2 transition-colors ">
                  <div
                    id="like"
                    onClick={handleRating}
                    className={`flex items-center gap-1 cursor-pointer rounded-3xl hover:bg-zinc-200/10 focus:bg-zinc-200/10 active:bg-zinc-200/10 px-2 py-0.5 max-w-max ${
                      rating.items[0].rating === "like" && "text-yellow-400"
                    }`}
                  >
                    {rating.items[0].rating === "like" ? (
                      <PiThumbsUpFill className="pointer-events-none" />
                    ) : (
                      <PiThumbsUpBold className="pointer-events-none" />
                    )}
                    <strong
                      className={`text-violet-200 ${
                        rating.items[0].rating === "like" && "text-yellow-400"
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
                      rating.items[0].rating === "dislike" && "text-yellow-400"
                    }`}
                  >
                    {rating.items[0].rating === "dislike" ? (
                      <PiThumbsDownFill />
                    ) : (
                      <PiThumbsDownBold />
                    )}
                  </div>
                </div>
                |
                <div className="flex items-center gap-2">
                  <strong className="text-violet-200">{date}</strong>
                </div>
              </div>

              <pre className="p-2 mt-2 text-purple-100 rounded-3xl text-wrap glass-dark">
                <span onClick={(e) => handleTimestamp(e)}>
                  {parse(modifiedDescription || "")}
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
                        }}
                        key={tag}
                        className="px-2 py-1 font-bold rounded-3xl bg-slate-500 cursor-crosshair text-slate-950"
                      >
                        #{tag.split(" ").join("_")}
                      </span>{" "}
                    </>
                  ))}
                </div>
              </pre>
            </div>
          </div>
        </div>
        <div className="w-[25%] text-center ml-5 h-full flex flex-col gap-3 overflow-y-scroll hideScrollbar">
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
              placeholder="Add your comment..."
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMyComment(e.target.value)
              }
            />
          </div>
          <div className="flex gap-6 mx-auto">
            <button
              onClick={() => setMyComment("")}
              className="px-3 py-2 transition duration-300 ease-in-out rounded-full cursor-pointer delay-50 hover:bg-gray-500/50"
            >
              Cancel
            </button>
            <button
              onClick={() => comMutation.mutate(videoId)}
              className={`transition duration-300 ease-in-out delay-50 px-3 py-2 rounded-full cursor-pointer bg-gray-500/50 hover:bg-pink-400 ${
                myComment.length > 0 && "bg-pink-500"
              }`}
            >
              Comment
            </button>
          </div>

          {comments?.items[0]?.kind === "" ? (
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
              className="hideScrollbar"
              increaseViewportBy={100}
              data={comments?.items}
              totalCount={Number(
                video?.items[0]?.statistics?.commentCount || 0
              )}
              itemContent={(_, data) => (
                <div className="pt-3">
                  <Comments
                    key={data?.id}
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
        </div>
      </div>
    </div>
  );
};

export default Player;
