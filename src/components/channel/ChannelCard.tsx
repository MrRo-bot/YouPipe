import { motion } from "framer-motion";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FcStart } from "react-icons/fc";

const ChannelCard = () => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      className="z-0 p-2 m-3 transition-all cursor-pointer max-w-96 group glass rounded-2xl"
    >
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden aspect-[16/9] bg-zinc-200 rounded-2xl">
          <img
            referrerPolicy="no-referrer"
            src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=480"
            alt=""
            className="object-fill transition group-hover:scale-110 group-focus:scale-110"
          />
          <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
            2:30
          </div>
        </div>
        <div className="flex flex-col gap-3 px-2">
          <div className="flex justify-between">
            <div className="w-11/12 text-sm text-ellipsis line-clamp-2">
              Columbus Crew vs. Inter Miami CF | 2024 Supporters' Shield
              Clinched! | Full Match Highlights
            </div>
            <div className="ml-auto transition hover:scale-105 focus:scale-105">
              <PiDotsThreeOutlineVerticalFill />
            </div>
          </div>
          <div className="flex justify-start gap-1">
            <div className="flex items-center gap-1">
              <FcStart className="w-3 h-3" />
              <div className="text-xs tracking-tighter text-zinc-400">
                162k views
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-xs tracking-tighter text-zinc-400">
                • 12 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelCard;
