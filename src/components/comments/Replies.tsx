import React, { RefObject, useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import parse from "html-react-parser";

import {
  PiPencilBold,
  PiThumbsUpFill,
  PiThumbsUpLight,
  PiTrashBold,
} from "react-icons/pi";

import { useAppSelector } from "../../app/store";

import { elapsedTime, rawViewsToString } from "../../utils/functions";

import { CommentReplyType } from "../../types/types";

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
  ref: RefObject<HTMLSpanElement>;
}

const Replies = ({
  comment,
  updateReply,
  channelId,
  deleteReply,
  likeCount,
  ref,
}: RepliesType) => {
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [editedReply, setEditedReply] = useState(
    comment?.snippet?.textOriginal || ""
  );

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
    <div key={comment?.id} className="py-1">
      <div
        className={`flex p-1 mx-1 rounded-xl ${
          channelId === comment?.snippet?.authorChannelId?.value
            ? "bg-black/50"
            : "glass-dark"
        }`}
      >
        <div className="w-[15%] p-1">
          <img
            referrerPolicy="no-referrer"
            className="w-10 h-10 mx-auto text-center rounded-full outline outline-1 outline-yellow-400"
            src={comment?.snippet?.authorProfileImageUrl}
            alt=""
          />
        </div>
        <div className="w-[85%] flex flex-col gap-2">
          <div>
            <div className="flex justify-between font-medium text-left text-yellow-400">
              {comment?.snippet?.authorDisplayName}
              {comment &&
                comment?.snippet?.authorChannelId.value ===
                  profileChannelId && (
                  <div className="flex items-center justify-between gap-2">
                    <div
                      onClick={() =>
                        deleteReply({ commentId: "", replyId: comment?.id })
                      }
                    >
                      <PiTrashBold className="w-5 h-5 cursor-pointer text-zinc-200" />
                    </div>
                    <div onClick={handleEditReply}>
                      <PiPencilBold className="w-5 h-5 cursor-pointer text-zinc-200" />
                    </div>
                  </div>
                )}
            </div>
            <div className="font-medium text-left text-zinc-400">
              {comment?.snippet?.publishedAt === comment?.snippet?.updatedAt
                ? elapsedTime(publishedAt) + " ago"
                : elapsedTime(updatedAt) + " ago" + " (edited)"}
            </div>
          </div>
          <div className="text-left text-zinc-100">
            {isEditingReply ? (
              <div className="my-2">
                <div className="relative w-full">
                  <div className="overflow-y-hidden min-h-10 whitespace-pre-wrap break-words w-full invisible leading-[24px]">
                    {editedReply}
                  </div>
                  <textarea
                    className="hideScrollbar absolute p-2 text-zinc-100 bg-transparent focus:bg-slate-700/20 right-0 top-0 bottom-0 left-0 resize-none leading-[24px] border-b-2 border-b-slate-500 focus:border-b-white ring-0 border-0 outline-none"
                    value={editedReply}
                    autoFocus={true}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditedReply(e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-6 mx-auto mt-2">
                  <button
                    onClick={handleCancelEditReply}
                    className="px-2 py-1 text-sm transition duration-300 ease-in-out rounded-full cursor-pointer delay-50 hover:bg-gray-500/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReply}
                    className={`transition delay-50 duration-300 ease-in-out px-2 py-1 text-sm rounded-full cursor-pointer bg-gray-500/50 hover:bg-pink-400 ${
                      editedReply.length > 0 && "bg-pink-500"
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span ref={ref}>{parse(modifiedReply)}</span>
            )}
          </div>

          {comment?.snippet?.likeCount !== 0 ? (
            <div className="flex text-sm items-center gap-2 max-w-max rounded-3xl px-2 py-0.5 bg-slate-500/20 min-w-12 min-h-6">
              {rawViewsToString(String(likeCount))}{" "}
              {<PiThumbsUpFill className="w-4 h-4 -scale-x-100" />}
            </div>
          ) : (
            <div className="flex text-sm items-center gap-2 max-w-max rounded-3xl px-2 py-0.5 bg-slate-500/20 min-w-12 min-h-6">
              0 {<PiThumbsUpLight className="w-4 h-4 -scale-x-100" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Replies;
