import { motion } from "framer-motion";
import { SkeletonTheme } from "react-loading-skeleton";
import { elapsedTime } from "../utils/functions";

const Comment = ({ comment }) => {
  const comm = comment?.snippet?.topLevelComment?.snippet;
  //creating date value from ISO 8601 format
  const myPubDate = new Date(comm?.publishedAt || "");
  const myUpdDate = new Date(comm?.updatedAt || "");

  //getting time from date
  const publishedAt = myPubDate.getTime();
  const updatedAt = myUpdDate.getTime();
  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <motion.div
        variants={{
          hidden: { scale: 0.7 },
          visible: { scale: 1 },
        }}
        transition={{ type: "keyframes" }}
        initial={"hidden"}
        whileInView={"visible"}
        className="flex p-1 mx-1 rounded-xl glass-dark"
      >
        <div className="w-[15%] p-1">
          <img
            className="w-10 h-10 mx-auto text-center rounded-full outline outline-1 outline-yellow-400"
            src={comm?.authorProfileImageUrl}
            alt={comm?.authorDisplayName[1]?.toUpperCase()}
          />
        </div>
        <div className="w-[85%] flex flex-col gap-2">
          <div>
            <div className="font-bold text-left text-yellow-400">
              {comm?.authorDisplayName}
            </div>
            <div className="font-medium text-left text-zinc-400">
              {comm?.publishedAt === comm?.updatedAt
                ? elapsedTime(publishedAt) + " ago"
                : elapsedTime(updatedAt) + " ago" + " (edited)"}
            </div>
          </div>
          <div className="text-left text-zinc-100 line-clamp-6 text-ellipsis">
            {comm?.textOriginal}
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default Comment;
