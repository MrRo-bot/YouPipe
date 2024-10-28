import { motion } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiBellRingingFill, PiCheckCircleFill } from "react-icons/pi";
import { SubscriptionType } from "../types/types";

const SubscriptionCard = (data: { key: string; data: SubscriptionType }) => {
  const snippet = data?.data?.snippet;
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
        <div className="transition min-w-32 grid object-cover aspect-square rounded-full overflow-hidden cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
          <img
            className="w-full h-full"
            src={snippet?.thumbnails?.default?.url}
            alt={snippet?.title}
          />
        </div>
        <div className="flex flex-col gap-3 px-1">
          <div className="flex items-center gap-1">
            <div className="text-2xl text-ellipsis line-clamp-2">
              {snippet?.title}
            </div>
            <div className="pt-1 transition hover:scale-105 focus:scale-105">
              <PiCheckCircleFill />
            </div>
          </div>

          <div className="flex items-center justify-start gap-1">
            <div className="text-xs tracking-wide text-zinc-400 text-ellipsis">
              @{snippet?.title?.toLowerCase()} • number Subscribers
            </div>
          </div>

          <div className="w-5/6 line-clamp-2 text-ellipsis">
            <p className="text-xs text-zinc-400">{snippet?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 ml-auto font-medium rounded-full cursor-pointer bg-zinc-800 max-w-max">
          <PiBellRingingFill className="w-5 h-5" /> Subscribed
          <MdKeyboardArrowDown />
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
