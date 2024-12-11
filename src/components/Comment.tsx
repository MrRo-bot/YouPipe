import { MouseEvent, useState } from "react";
import { motion } from "framer-motion";
import { SkeletonTheme } from "react-loading-skeleton";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import parse from "html-react-parser";

import { elapsedTime, rawViewsToString } from "../utils/functions";
import { CommentType } from "../types/types";
import { useAppDispatch } from "../app/store";
import { addTimestamp } from "../features/timestampSlice";
import { PiThumbsUpFill } from "react-icons/pi";

const Comment = ({
  comment,
  channelId,
}: {
  comment: CommentType;
  channelId: string;
}) => {
  const [expand, setExpand] = useState(false);

  const dispatch = useAppDispatch();

  const comm = comment?.snippet?.topLevelComment?.snippet;
  const replies = comment?.replies?.comments;
  const replyCount = replies?.length || 0;

  //creating date value from ISO 8601 format
  const myPubDate = new Date(comm?.publishedAt || "");
  const myUpdDate = new Date(comm?.updatedAt || "");

  //getting time from date
  const publishedAt = myPubDate.getTime();
  const updatedAt = myUpdDate.getTime();

  const handleTimestamp = (e: MouseEvent<HTMLSpanElement>) => {
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

  //handling timestamp
  const modifiedComment = comm?.textOriginal.replace(
    /(\d*:?\d{1,2}:\d{1,2})/gm,
    (match) =>
      `<code className="cursor-pointer rounded-md px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors">${match}</code>`
  );

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
              ?.value && "bg-slate-900"
        }`}
      >
        <div className="w-[15%] p-1">
          <img
            className="relative w-10 h-10 mx-auto text-center rounded-full outline outline-1 outline-yellow-400"
            src={comm?.authorProfileImageUrl}
            alt={comm?.authorDisplayName[1]?.toUpperCase()}
          />
        </div>
        <div className="w-[85%] flex flex-col gap-2">
          <div>
            <div className="font-medium text-left text-yellow-400">
              {comm?.authorDisplayName}
            </div>
            <div className="font-medium text-left text-zinc-400">
              {comm?.publishedAt === comm?.updatedAt
                ? elapsedTime(publishedAt) + " ago"
                : elapsedTime(updatedAt) + " ago" + " (edited)"}
            </div>
          </div>
          <div className="text-left text-zinc-100">
            <span onClick={(e) => handleTimestamp(e)}>
              {parse(modifiedComment || "")}
            </span>
          </div>
          {comm?.likeCount !== 0 ? (
            <div className="transition-colors cursor-pointer flex text-sm items-center gap-2 hover:bg-zinc-200/10 focus:bg-zinc-200/10 active:bg-zinc-200/10 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400 max-w-max rounded-3xl px-2 py-0.5">
              {rawViewsToString(String(comm?.likeCount))}{" "}
              {<PiThumbsUpFill className="w-4 h-4 -scale-x-100" />}
            </div>
          ) : (
            ""
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
                {replies?.map((comment) => {
                  const myUpdDate = new Date(comment?.snippet?.updatedAt || "");
                  const myPubDate = new Date(
                    comment?.snippet?.publishedAt || ""
                  );
                  //getting time from date
                  const publishedAt = myPubDate.getTime();
                  const updatedAt = myUpdDate.getTime();

                  //handling timestamp
                  const modifiedReply = comment?.snippet?.textOriginal.replace(
                    /(\d*:?\d{1,2}:\d{1,2})/gm,
                    (match) =>
                      `<code className="cursor-pointer rounded-md px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors">${match}</code>`
                  );

                  return (
                    <div
                      className={`flex p-1 mx-1 rounded-xl ${
                        channelId === comment?.snippet?.authorChannelId?.value
                          ? "bg-black/50"
                          : "glass-dark"
                      }`}
                    >
                      <div className="w-[15%] p-1">
                        <img
                          className="w-10 h-10 mx-auto text-center rounded-full outline outline-1 outline-yellow-400"
                          src={comment?.snippet?.authorProfileImageUrl}
                          alt={comment?.snippet?.authorDisplayName[1]?.toUpperCase()}
                        />
                      </div>
                      <div className="w-[85%] flex flex-col gap-2">
                        <div>
                          <div className="font-medium text-left text-yellow-400">
                            {comment?.snippet?.authorDisplayName}
                          </div>
                          <div className="font-medium text-left text-zinc-400">
                            {comment?.snippet?.publishedAt ===
                            comment?.snippet?.updatedAt
                              ? elapsedTime(publishedAt) + " ago"
                              : elapsedTime(updatedAt) + " ago" + " (edited)"}
                          </div>
                        </div>
                        <div className="text-left text-zinc-100">
                          <span onClick={(e) => handleTimestamp(e)}>
                            {parse(modifiedReply)}
                          </span>
                        </div>
                        {comment?.snippet?.likeCount !== 0 ? (
                          <div className="transition-colors text-sm cursor-pointer flex items-center gap-2 hover:bg-zinc-200/10 focus:bg-zinc-200/10 active:bg-zinc-200/10 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400 max-w-max rounded-3xl px-2 py-0.5">
                            {rawViewsToString(
                              String(comment?.snippet?.likeCount)
                            )}{" "}
                            {
                              <PiThumbsUpFill className="w-4 h-4 -scale-x-100" />
                            }
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default Comment;
