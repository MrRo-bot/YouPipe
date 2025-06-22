import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parse from "html-react-parser";

import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import {
  PiPencilBold,
  PiTrashBold,
  PiThumbsUpFill,
  PiThumbsUpLight,
} from "react-icons/pi";
import { FaRegCommentAlt } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  addReply,
  deleteComment,
  deleteReply,
  updateComment,
  updateReply,
} from "../../features/commentsThreadSlice";
import { addTimestamp } from "../../features/timestampSlice";

import { elapsedTime, rawViewsToString } from "../../utils/functions";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import Replies from "./Replies";

import { CommentType, TokensType } from "../../types/types";

const Comments = ({
  comment,
  channelId,
}: {
  comment: CommentType;
  channelId: string;
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  const [expand, setExpand] = useState(false);
  const [toggleReply, setToggleReply] = useState(false);
  const [myReply, setMyReply] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedComment, setEditedComment] = useState(
    comment?.snippet?.topLevelComment?.snippet?.textOriginal || ""
  );

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

  const comm = comment?.snippet?.topLevelComment?.snippet;
  const replies = comment?.replies?.comments;
  const replyCount = replies?.length || 0;
  const myPubDate = new Date(comm?.publishedAt || "").getTime();
  const myUpdDate = new Date(comm?.updatedAt || "").getTime();

  const timestampRegex = /\b(?=[0-5]?\d)(?:[0-5]?\d)(?::[0-5]?\d){1,2}\b/gm;

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

  const modifiedComment = comm?.textOriginal.replace(
    timestampRegex,
    (match: string) =>
      `<code className="cursor-pointer rounded-md px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors">${match}</code>`
  );

  //attaching handleTimestamp function in code tags inside the paragraph that contains timestamps
  useEffect(() => {
    const codeElement = containerRef?.current?.querySelectorAll("code");
    //@ts-expect-error type not found
    const codeElementArray = Array?.from(codeElement);

    codeElementArray.map((x) => {
      //@ts-expect-error type not found
      x?.addEventListener("click", handleTimestamp);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //adding a reply
  const replyMutation = useMutation({
    mutationFn: async (reply: string) => {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/comments?part=id%2Csnippet&key=${
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
              textOriginal: reply,
              parentId: comment?.snippet?.topLevelComment?.id,
            },
          }),
        }
      );
      const replyData = await response.json();
      dispatch(addReply(replyData));
    },
    onSuccess: () => {
      setMyReply("");
      setToggleReply(false);
      toast("💬 reply added!", {
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
  //edit comment or reply

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      text,
      isReply,
    }: {
      id: string;
      text: string;
      isReply: boolean;
    }) => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/comments?id=${id}&part=snippet&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
          body: JSON.stringify({
            snippet: {
              textOriginal: text,
            },
          }),
        }
      );
      const updatedData = await res.json();
      dispatch(
        isReply
          ? updateReply({ replyId: id, text })
          : updateComment({ commentId: id, text })
      );
      return updatedData;
    },
    onSuccess: () => {
      toast("💬 updated!", {
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
    onError: (e: Error) => {
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

  //delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (commentIds: { commentId: string; replyId: string }) => {
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/comments?id=${
          commentIds.commentId || commentIds.replyId
        }&key=${import.meta.env.VITE_API_KEY}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      dispatch(
        commentIds.commentId
          ? deleteComment(commentIds.commentId)
          : deleteReply(commentIds.replyId)
      );
    },
    onSuccess: () => {
      toast(`💬 deleted!`, {
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

  //delete a comment or reply
  const handleDelete = (commentIds: { commentId: string; replyId: string }) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate(commentIds);
    }
  };

  // Handle edit comment
  const handleEditComment = () => {
    setIsEditingComment(true);
  };

  // Handle save comment
  const handleSaveComment = () => {
    if (editedComment.trim()) {
      updateMutation.mutate({
        id: comment?.id,
        text: editedComment,
        isReply: false,
      });
      setIsEditingComment(false);
    } else {
      toast.error("Comment cannot be empty!", {
        position: "bottom-left",
        autoClose: 3000,
        className: "!toastGradientError !font-bold !text-zinc-50",
        transition: Bounce,
      });
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingComment(false);
    setEditedComment(comm?.textOriginal || "");
  };

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <motion.div
        variants={{
          hidden: { translateX: 100 },
          visible: { translateX: 0 },
        }}
        transition={{ type: "keyframes" }}
        initial={"hidden"}
        whileInView={"visible"}
        className={`flex p-1 mx-1 rounded-xl glass-dark ${
          channelId ===
            comment?.snippet?.topLevelComment?.snippet?.authorChannelId
              ?.value && "bg-slate-950"
        }`}
      >
        <div className="w-[15%] p-1">
          <img
            referrerPolicy="no-referrer"
            className="relative w-10 h-10 mx-auto text-center rounded-full outline outline-1 outline-yellow-400"
            src={comm?.authorProfileImageUrl}
            alt=""
          />
        </div>
        <div className="w-[85%] flex flex-col gap-2">
          <div>
            <div className="flex justify-between font-medium text-left text-yellow-400">
              {comm?.authorDisplayName}
              {comm && comm?.authorChannelId.value === profileChannelId && (
                <div className="flex items-center justify-between gap-2">
                  <div
                    onClick={() =>
                      handleDelete({ commentId: comment?.id, replyId: "" })
                    }
                  >
                    <PiTrashBold className="w-5 h-5 cursor-pointer text-zinc-200" />
                  </div>

                  <div onClick={handleEditComment}>
                    <PiPencilBold className="w-5 h-5 cursor-pointer text-zinc-200" />
                  </div>
                </div>
              )}
            </div>
            <div className="font-medium text-left text-zinc-400">
              {comm?.publishedAt === comm?.updatedAt
                ? elapsedTime(myPubDate) + " ago"
                : elapsedTime(myUpdDate) + " ago" + " (edited)"}
            </div>
          </div>
          {isEditingComment ? (
            <div className="my-2">
              <div className="relative w-full">
                <div className="overflow-y-hidden min-h-10 whitespace-pre-wrap break-words w-full invisible leading-[24px]">
                  {editedComment}
                </div>
                <textarea
                  className="hideScrollbar absolute p-2 text-zinc-100 bg-transparent focus:bg-slate-700/20 right-0 top-0 bottom-0 left-0 resize-none leading-[24px] border-b-2 border-b-slate-500 focus:border-b-white ring-0 border-0 outline-none"
                  value={editedComment}
                  autoFocus={true}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditedComment(e.target.value)
                  }
                />
              </div>
              <div className="flex gap-6 mx-auto mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-sm transition duration-300 ease-in-out rounded-full cursor-pointer delay-50 hover:bg-gray-500/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveComment}
                  className={`transition delay-50 duration-300 ease-in-out px-2 py-1 text-sm rounded-full cursor-pointer bg-gray-500/50 hover:bg-pink-400 ${
                    editedComment.length > 0 && "bg-pink-500"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-left text-zinc-100">
              <span ref={containerRef}>{parse(modifiedComment || "")}</span>
            </div>
          )}
          <div className="flex items-center justify-start w-1/2 gap-6">
            {comm?.likeCount !== 0 ? (
              <div className="flex text-sm items-center gap-2 max-w-max rounded-3xl px-2 py-0.5  bg-pink-500 text-yellow-400 min-w-12 min-h-6">
                {rawViewsToString(String(comm?.likeCount))}{" "}
                {
                  <PiThumbsUpFill className="w-4 h-4 text-yellow-400 -scale-x-100" />
                }
              </div>
            ) : (
              <div className="flex text-sm items-center gap-2 max-w-max rounded-3xl px-2 py-0.5 bg-slate-500/20 min-w-12 min-h-6">
                0 {<PiThumbsUpLight className="w-4 h-4 -scale-x-100" />}
              </div>
            )}
            <div
              onClick={() => setToggleReply(!toggleReply)}
              className="px-3 py-2 cursor-pointer hover:bg-slate-500/20 rounded-3xl"
            >
              <FaRegCommentAlt className="w-3 h-3 scale-x-100" />
            </div>
          </div>
          {toggleReply && (
            <div className="my-2">
              <div className="relative w-full">
                <div className="overflow-y-hidden min-h-10 whitespace-pre-wrap break-words w-full invisible leading-[24px]">
                  {myReply}
                </div>{" "}
                <textarea
                  className="hideScrollbar absolute p-2 text-zinc-100  bg-transparent focus:bg-slate-700/20 right-0 top-0 bottom-0 left-0 resize-none leading-[24px] border-b-2 border-b-slate-500 focus:border-b-white ring-0 border-0 outline-none"
                  value={myReply}
                  placeholder="Add your reply..."
                  autoFocus={true}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMyReply(e.target.value)
                  }
                />
              </div>
              <div className="flex gap-6 mx-auto mt-2">
                <button
                  onClick={() => setToggleReply(false)}
                  className="px-2 py-1 text-sm transition duration-300 ease-in-out rounded-full cursor-pointer delay-50 hover:bg-gray-500/50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => replyMutation.mutate(myReply)}
                  className={`transition delay-50 duration-300 ease-in-out px-2 py-1 text-sm rounded-full cursor-pointer bg-gray-500/50 hover:bg-pink-400 ${
                    myReply.length > 0 && "bg-pink-500"
                  }`}
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {replyCount >= 1 && (
            <>
              <div
                onClick={() => setExpand(!expand)}
                className={`flex items-center gap-2 px-2 py-1 my-1 text-yellow-400 transition-colors rounded-full cursor-pointer ${
                  expand ? "bg-indigo-950" : "bg-purple-950"
                } hover:bg-violet-950 active:bg-violet-900 focus:bg-violet-950 max-w-max`}
              >
                {expand ? (
                  <IoIosArrowDropupCircle className="w-5 h-5 transition-all" />
                ) : (
                  <IoIosArrowDropdownCircle className="w-5 h-5 transition-all" />
                )}{" "}
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </div>
              <div className={`${expand ? "block" : "hidden"} transition-all`}>
                {replies?.map((comment) => (
                  <Replies
                    comment={comment}
                    updateReply={updateMutation}
                    channelId={channelId}
                    deleteReply={handleDelete}
                    likeCount={comm?.likeCount}
                    ref={containerRef}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default Comments;
