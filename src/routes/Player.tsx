import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { PiThumbsDownFill, PiThumbsUpFill } from "react-icons/pi";

import ReactPlayer from "react-player/youtube";

import Comment from "../components/Comment";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { CommentListType, TokensType, VideosListType } from "../types/types";
import { rawViewsToString } from "../utils/functions";
import { addCommentsThread } from "../features/commentsThreadSlice";
import { useAppDispatch, useAppSelector } from "../app/store";
import { Virtuoso } from "react-virtuoso";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

//footer shows loading or end of list
const Footer = ({
  context: { comments: comments, video: video },
}: {
  context: { comments: CommentListType; video: VideosListType };
}) => {
  return comments?.items?.length <
    Number(video?.items[0]?.statistics?.commentCount) ? (
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

const Player = () => {
  //params for getting parameters passed in route link
  const { videoId } = useParams();

  //dispatch reducer functions
  const dispatch = useAppDispatch();

  //store for comments
  const comments = useAppSelector((state) => state.commentsThread);

  //fetch more comments
  const [fetchMore, setFetchMore] = useState<boolean>(true);

  //getting token from localStorage
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //parts used in API calls
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

  //query for getting video details
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  //creating date value from ISO 8601 format
  const myDate = new Date(video?.items[0]?.snippet?.publishedAt || "");

  //getting time from date
  const result = myDate.toLocaleDateString();

  //query for getting video comments
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
    enabled: !!videoId || !!fetchMore,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <div className="w-full h-[90vh] pt-5">
      <div className="flex w-[95%] h-full mx-auto">
        <div className="w-[75%] overflow-y-scroll hideScrollbar">
          <div className="relative">
            <div className="w-full h-full overflow-hidden aspect-video rounded-3xl">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${videoId}`}
                playing={false}
                controls={true}
                volume={0.1}
                playbackRate={1}
                pip={true}
                width={100 + "%"}
                height={100 + "%"}
              />
            </div>

            <div className="absolute w-full px-3 py-2 mt-2 -translate-x-1/2 rounded-3xl glass left-1/2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-3xl glass-dark w-max">
                <div className="flex items-center gap-2">
                  <strong className="text-violet-200">
                    {rawViewsToString(
                      video?.items[0]?.statistics?.viewCount || "0"
                    )}
                  </strong>{" "}
                  views
                </div>
                |
                <div className="flex items-center gap-2">
                  <PiThumbsUpFill />
                  <strong className="text-violet-200">
                    {rawViewsToString(
                      video?.items[0]?.statistics?.likeCount || "0"
                    )}
                  </strong>{" "}
                  Likes • <PiThumbsDownFill />
                </div>
                |
                <div className="flex items-center gap-2">
                  <strong className="text-violet-200">{result}</strong>
                </div>
              </div>

              <pre className="p-2 mt-2 text-purple-100 rounded-3xl text-wrap glass-dark">
                {video?.items[0]?.snippet?.description}
                <br />
                <br />
                {video?.items[0]?.snippet?.tags?.map((tag: string) => (
                  <>
                    <span
                      key={tag}
                      className="px-2 py-1 font-bold rounded-3xl bg-slate-500 text-slate-950"
                    >
                      #{tag.split(" ").join("_")}
                    </span>{" "}
                  </>
                ))}
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
          <div>
            <h3 className="my-2 font-bold">Sort By</h3>
          </div>

          {/* Virtuoso virtualized rendering of liked videos list for increased rendering performance */}

          {comments?.items?.length <= 1 ? (
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
                  <Comment key={data.id} comment={data} />
                </div>
              )}
              endReached={() => setTimeout(() => setFetchMore(true), 500)}
              context={{ comments: comments, video: video }}
              components={{ Footer }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
