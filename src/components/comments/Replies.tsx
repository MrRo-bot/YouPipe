import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, UseMutationResult } from "@tanstack/react-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parse from "html-react-parser";

import {
  PiPencilBold,
  PiPlusBold,
  PiThumbsUpFill,
  PiThumbsUpLight,
  PiTrashBold,
} from "react-icons/pi";

import { useAppDispatch, useAppSelector } from "../../app/store";
import { addTimestamp } from "../../features/timestampSlice";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import { elapsedTime, rawViewsToString } from "../../utils/functions";

import {
  ChannelInfoType,
  CommentReplyType,
  TokensType,
} from "../../types/types";

interface RepliesType {
  comment: CommentReplyType;
  updateReply: UseMutationResult<
    unknown,
    Error,
    { id: string; text: string; isReply: boolean },
    unknown
  >;
  channelId: string;
  deleteReply: (commentIds: { commentId: string; replyId: string }) => void;
  likeCount: number | undefined;
}

const Replies = ({
  comment,
  updateReply,
  channelId,
  deleteReply,
  likeCount,
}: RepliesType) => {
  const replyRef = useRef<HTMLSpanElement>(null);
  const userRef = useRef<HTMLDialogElement>(null);

  const [isEditingReply, setIsEditingReply] = useState(false);
  const [editedReply, setEditedReply] = useState(
    comment?.snippet?.textOriginal || ""
  );
  const [authorProfile, setAuthorProfile] = useState<ChannelInfoType>();
  const [fetchAuthorData, setFetchAuthorData] = useState(false);

  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const dispatch = useAppDispatch();

  const profileChannelId = useAppSelector((state) => state.profile.channelId);

  const myUpdDate = new Date(comment?.snippet?.updatedAt || "");
  const myPubDate = new Date(comment?.snippet?.publishedAt || "");
  const publishedAt = myPubDate.getTime();
  const updatedAt = myUpdDate.getTime();

  //handling timestamp
  const modifiedReply = comment?.snippet?.textOriginal.replace(
    /(\d*:?\d{1,2}:\d{1,2})/gm,
    (match: string) =>
      `<code className="cursor-pointer rounded-md px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors">${match}</code>`
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

  //attaching handleTimestamp function in code tags inside the paragraph that contains timestamps
  useEffect(() => {
    const codeElement = replyRef?.current?.querySelectorAll("code");
    //@ts-expect-error type not found
    const codeElementArray = Array?.from(codeElement);

    codeElementArray.map((x) => {
      //@ts-expect-error type not found
      x?.addEventListener("click", handleTimestamp);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetching comment author data if needed
  const parts = ["statistics", "snippet"];
  useQuery({
    queryKey: ["replyAuthorProfile", fetchAuthorData],
    queryFn: async () => {
      setTimeout(async () => {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/channels?id=${
            comment?.snippet?.authorChannelId?.value
          }&part=${parts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        const channelStats = await res.json();
        setFetchAuthorData(false);
        setAuthorProfile(channelStats);
        return channelStats;
      }, 1000);
    },
    enabled: !!fetchAuthorData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const date = new Date(
    authorProfile?.items[0]?.snippet?.publishedAt || ""
  ).getTime();

  // Handle edit reply
  const handleEditReply = () => {
    setIsEditingReply(true);
  };

  // Handle save reply
  const handleSaveReply = () => {
    if (editedReply.trim()) {
      updateReply.mutate({
        id: comment?.id,
        text: editedReply,
        isReply: true,
      });
      setIsEditingReply(false);
    } else {
      toast.error("Reply cannot be empty!", {
        position: "bottom-left",
        autoClose: 3000,
        className: "!toastGradientError !font-bold !text-zinc-50",
        transition: Bounce,
      });
    }
  };

  // Handle cancel edit reply
  const handleCancelEditReply = () => {
    setIsEditingReply(false);
    setEditedReply(comment?.snippet?.textOriginal || "");
  };
  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <div key={comment?.etag} className="lg:py-1 py-0.5">
        <div
          className={`flex p-1 rounded-xl ${
            channelId === comment?.snippet?.authorChannelId?.value
              ? "bg-black/50"
              : "glass-dark"
          }`}
        >
          <div className="w-[15%] p-1">
            <div className="grid place-items-center relative rounded-full size-6 lg:size-10 overflow-hidden transition-shadow cursor-pointer mx-auto shadow-[0_0_0_2px_rgb(250_204_21)] hover:shadow-[0_0_0_3px_rgb(250_204_50)] focus:shadow-[0_0_0_3px_rgb(250_204_50)]">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  setFetchAuthorData(true);
                  userRef?.current?.showModal();
                }}
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={comment?.snippet?.authorProfileImageUrl}
                alt=""
              />
            </div>
          </div>

          <dialog
            className="flex flex-col gap-2 px-4 py-2 overflow-hidden font-semibold min-w-[33%] rounded-2xl heroGradient backdrop:backdrop-blur-sm text-zinc-100"
            ref={userRef}
          >
            <h2 className="self-start text-base font-bold lg:text-2xl text-zinc-50">
              Channel Info
            </h2>
            <div
              onClick={(e) => {
                e.stopPropagation();
                userRef?.current?.close();
              }}
              className="absolute p-2 rounded-full cursor-pointer top-1 right-1 hover:backdrop-blur-sm hover:bg-zinc-50/20 active:bg-zinc-50/20"
            >
              <PiPlusBold className="rotate-45 size-5 text-zinc-50" />
            </div>
            <div className="lg:flex-row flex-col p-2 bg-zinc-100/10 rounded-2xl flex gap-2 lg:gap-5 justify-start backdrop-blur-2xl shadow-[0_0_0_1px_rgb(255,255,255,0.15)]">
              <div>
                <div
                  className="grid place-items-center w-max h-max mx-auto shadow-[0_0_0_1px_rgb(250_204_21)]
              relative overflow-hidden rounded-full min-w-24 lg:min-w-28 xl:min-w-32 min-h-24 lg:min-h-28 xl:min-h-32"
                >
                  {fetchAuthorData ? (
                    <Skeleton
                      circle={true}
                      height="100%"
                      containerClassName="absolute inset-0"
                      className="absolute inset-0 w-full h-full -top-0.5"
                    />
                  ) : (
                    <img
                      referrerPolicy="no-referrer"
                      src={
                        authorProfile?.items[0]?.snippet?.thumbnails?.high?.url
                      }
                      className="absolute inset-0 object-cover w-full h-full rounded-full"
                      alt={authorProfile?.items[0]?.snippet?.title[0]}
                    />
                  )}
                </div>
              </div>
              <div className="w-full">
                <div className="flex flex-col">
                  {fetchAuthorData ? (
                    <Skeleton className="min-w-full mb-2 min-h-8" />
                  ) : (
                    <div className="text-xl font-extrabold text-left lg:text-3xl text-zinc-50">
                      {authorProfile?.items[0]?.snippet?.localized?.title}
                    </div>
                  )}

                  {fetchAuthorData ? (
                    <Skeleton className="min-w-full mb-2 min-h-8" />
                  ) : (
                    <div className="text-sm font-bold text-left text-yellow-500 lg:text-base">
                      {authorProfile?.items[0]?.snippet?.customUrl}
                    </div>
                  )}

                  {fetchAuthorData ? (
                    <Skeleton
                      containerClassName="flex gap-2"
                      className="w-10 h-4 mt-1"
                      count={4}
                    />
                  ) : (
                    <div className="flex items-center justify-start gap-2 mt-1 text-sm font-light lg:text-base text-zinc-300">
                      <div>
                        Joined <strong>{elapsedTime(date)}</strong> ago
                      </div>
                      <div>
                        <strong>
                          {rawViewsToString(
                            authorProfile?.items[0]?.statistics
                              ?.subscriberCount || ""
                          )}
                        </strong>{" "}
                        subscribers
                      </div>
                      <div>
                        <strong>
                          {rawViewsToString(
                            authorProfile?.items[0]?.statistics?.viewCount || ""
                          )}
                        </strong>{" "}
                        views
                      </div>
                      <div>
                        <strong>
                          {rawViewsToString(
                            authorProfile?.items[0]?.statistics?.videoCount ||
                              ""
                          )}
                        </strong>{" "}
                        videos
                      </div>
                    </div>
                  )}
                </div>
                {fetchAuthorData ? (
                  <div className="items-start mt-6 w-max">
                    <Skeleton className="!w-24 px-2 py-1 !rounded-full" />
                  </div>
                ) : (
                  <>
                    <div
                      className="py-0.5 px-1 mt-6 transition-colors rounded-full cursor-pointer lg:px-2 lg:py-1 w-max bg-zinc-50 text-zinc-800 hover:bg-zinc-800 focus:bg-zinc-800 active:bg-zinc-800 hover:text-zinc-50 focus:text-zinc-50 active:text-zinc-50"
                      onClick={() =>
                        navigate(`/channel/${authorProfile?.items[0]?.id}`)
                      }
                    >
                      View Channel
                    </div>
                  </>
                )}
              </div>
            </div>
          </dialog>
          <div className="w-[85%] flex flex-col gap-2">
            <div>
              <div className="flex justify-between text-sm font-medium text-left text-yellow-400 lg:text-base">
                <span
                  className="transition-colors cursor-pointer hover:text-yellow-200 focus:text-yellow-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFetchAuthorData(true);
                    userRef?.current?.showModal();
                  }}
                >
                  {comment?.snippet?.authorDisplayName}
                </span>

                {comment &&
                  comment?.snippet?.authorChannelId.value ===
                    profileChannelId && (
                    <div className="flex items-center justify-between gap-1 lg:gap-2">
                      <div
                        onClick={() =>
                          deleteReply({ commentId: "", replyId: comment?.id })
                        }
                      >
                        <PiTrashBold className="cursor-pointer size-4 lg:size-5 text-zinc-200" />
                      </div>
                      <div onClick={handleEditReply}>
                        <PiPencilBold className="cursor-pointer size-4 lg:size-5 text-zinc-200" />
                      </div>
                    </div>
                  )}
              </div>
              <div className="text-xs font-medium text-left lg:text-sm text-zinc-400">
                {comment?.snippet?.publishedAt === comment?.snippet?.updatedAt
                  ? elapsedTime(publishedAt) + " ago"
                  : elapsedTime(updatedAt) + " ago" + " (edited)"}
              </div>
            </div>
            <div className="text-left text-zinc-100">
              {isEditingReply ? (
                <div className="my-1 lg:my-2">
                  <div className="relative w-full">
                    <div className="overflow-y-hidden min-h-10 whitespace-pre-wrap break-words w-full invisible leading-[24px]">
                      {editedReply}
                    </div>
                    <textarea
                      className="hideScrollbar text-xs lg:text-base absolute p-1 lg:p-2 text-zinc-100 bg-transparent focus:bg-slate-700/20 right-0 top-0 bottom-0 left-0 resize-none leading-[24px] border-b-2 border-b-slate-500 focus:border-b-white ring-0 border-0 outline-none"
                      value={editedReply}
                      autoFocus={true}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEditedReply(e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 mx-auto mt-1 lg:gap-6 lg:mt-2">
                    <button
                      onClick={handleCancelEditReply}
                      className="px-1 py-0.5 lg:px-2 lg:py-1 text-xs lg:text-sm transition duration-300 ease-in-out rounded-full cursor-pointer delay-50 hover:bg-gray-500/50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveReply}
                      className={`transition delay-50 duration-300 ease-in-out px-1 py-0.5 lg:px-2 lg:py-1 text-xs lg:text-sm rounded-full cursor-pointer bg-gray-500/50 hover:bg-pink-400 ${
                        editedReply.length > 0 && "bg-pink-500"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-left lg:text-base text-zinc-100">
                  <span ref={replyRef}>{parse(modifiedReply)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-start w-1/2 gap-4 lg:gap-6">
              {comment?.snippet?.likeCount !== 0 ? (
                <div className="flex text-xs lg:text-sm items-center justify-center gap-1 lg:gap-2 max-w-max rounded-3xl px-1 lg:px-2 py-0.5 bg-pink-500 text-yellow-400 min-w-10 lg:min-w-12 min-h-6">
                  {rawViewsToString(String(likeCount))}{" "}
                  {<PiThumbsUpFill className="size-3 lg:size-4 -scale-x-100" />}
                </div>
              ) : (
                <div className="flex text-sm items-center justify-center gap-1 lg:gap-2 max-w-max rounded-3xl px-1 lg:px-2 py-0.5 bg-slate-500/20 min-w-10 lg:min-w-12 min-h-6">
                  0{" "}
                  {
                    <PiThumbsUpLight className="size-3 lg:size-4 -scale-x-100" />
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default Replies;
