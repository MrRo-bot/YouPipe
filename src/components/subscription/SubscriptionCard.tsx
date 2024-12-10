import { useState } from "react";
import { motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { MdKeyboardArrowDown } from "react-icons/md";
import { PiBellRingingFill } from "react-icons/pi";

import { ChannelInfoType } from "../../types/types";
import { rawViewsToString } from "../../utils/functions";

const SubscriptionCard = ({ stat }: { stat: ChannelInfoType }) => {
  //skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const snippet = stat?.items[0]?.snippet;
  const statistics = stat?.items[0]?.statistics;

  return (
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
        className="z-0 p-2 transition-all cursor-pointer group glass rounded-2xl"
      >
        <div className="flex items-center justify-start gap-4">
          <div className="transition min-w-28 w-28 grid object-cover aspect-square rounded-full overflow-hidden cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            {snippet?.thumbnails && (
              <img
                onLoad={() => setIsImgLoaded(!isImgLoaded)}
                className="w-full h-full rounded-full"
                src={snippet?.thumbnails?.high?.url}
                alt=""
              />
            )}

            {!isImgLoaded && (
              <Skeleton
                width={120}
                height={120}
                circle
                className="-top-2 -left-1"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-7/12 px-1">
            <div className="flex items-center gap-1">
              {!snippet?.title ? (
                <Skeleton width={100} height={20} className="rounded-2xl" />
              ) : (
                <div className="text-xl text-ellipsis line-clamp-2">
                  {snippet?.title}
                </div>
              )}
            </div>

            <div className="flex items-center justify-start gap-1 mt-4">
              <div className="text-xs tracking-wide line-clamp-2 text-zinc-200 text-ellipsis">
                {!statistics ? (
                  <Skeleton width={300} height={10} className="rounded-2xl" />
                ) : (
                  `${snippet?.customUrl} • ${rawViewsToString(
                    statistics && statistics?.subscriberCount
                  )} Subs • ${rawViewsToString(
                    statistics && statistics?.viewCount
                  )} views • ${rawViewsToString(
                    statistics && statistics?.videoCount
                  )} videos`
                )}
              </div>
            </div>

            <div className="w-11/12 mt-1 line-clamp-2 text-ellipsis">
              {!snippet?.description ? (
                <Skeleton width={200} height={10} className="rounded-2xl" />
              ) : (
                <p className="text-xs text-zinc-400">{snippet?.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 mt-1 ml-auto font-medium rounded-full cursor-pointer bg-zinc-800">
            <PiBellRingingFill className="w-5 h-5" /> Subscribed
            <MdKeyboardArrowDown />
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default SubscriptionCard;
