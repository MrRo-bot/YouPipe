import { motion } from "framer-motion";

import { MdKeyboardArrowDown } from "react-icons/md";
import { PiBellRingingFill, PiCheckCircleFill } from "react-icons/pi";

import { ChannelInfoType } from "../types/types";
import { rawViewsToString } from "../utils/functions";

const SubscriptionCard = (data: { data: ChannelInfoType }) => {
  return (
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
          <img
            loading="lazy"
            className="w-full h-full"
            src={data?.data?.items[0]?.snippet?.thumbnails?.default?.url}
            alt={data?.data?.items[0]?.snippet?.title[0]}
          />
        </div>
        <div className="flex flex-col items-start px-1">
          <div className="flex items-center gap-1">
            <div className="text-xl text-ellipsis line-clamp-2">
              {data?.data?.items[0]?.snippet?.title}
            </div>
            <div className="pt-1 transition hover:scale-105 focus:scale-105">
              <PiCheckCircleFill />
            </div>
          </div>

          <div className="flex items-center justify-start gap-1 mt-4">
            <div className="text-xs tracking-wide text-zinc-200 text-ellipsis">
              {`${
                data?.data?.items[0]?.snippet?.customUrl
              } • ${rawViewsToString(
                data?.data?.items[0]?.statistics?.subscriberCount || "0"
              )} Subs • ${rawViewsToString(
                data?.data?.items[0]?.statistics?.viewCount || "0"
              )} views • ${rawViewsToString(
                data?.data?.items[0]?.statistics?.videoCount || "0"
              )} videos`}
            </div>
          </div>

          <div className="w-11/12 mt-1 line-clamp-2 text-ellipsis">
            <p className="text-xs text-zinc-400">
              {data?.data?.items[0]?.snippet?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 mt-1 ml-auto font-medium rounded-full cursor-pointer bg-zinc-800 max-w-max">
          <PiBellRingingFill className="w-5 h-5" /> Subscribed
          <MdKeyboardArrowDown />
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
