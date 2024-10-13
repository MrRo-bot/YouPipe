import { motion } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";

const WatchLaterCard = ({ count }: { count: number }) => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      className="flex items-center justify-between gap-1 p-2 transition-all cursor-pointer hover:bg-zinc-800/70 glass rounded-2xl"
    >
      <div className="flex">
        <div className="self-center mr-2">{count}</div>
        <div className="relative overflow-hidden max-w-52 aspect-video rounded-2xl">
          <img
            className="object-cover"
            src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=480"
            alt=""
          />
          <div className="absolute z-40 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
            2:30
          </div>
        </div>
        <div className="flex flex-col ml-3 flex-start">
          <div className="relative flex items-start justify-between gap-1">
            <h3 className="w-4/5 text-lg text-ellipsis line-clamp-1">
              Samay raina Reacts to Mr Bean in Cyberpunk 2077 Samay raina Reacts
              to Mr Bean in Cyberpunk 2077 Samay raina Reacts to Mr Bean in
              Cyberpunk 2077
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            Samay Raina • 1.7M views • 10 hours ago
          </div>
        </div>
      </div>

      <BsThreeDotsVertical className="cursor-pointer w-7 h-7 text-zinc-200" />
    </motion.div>
  );
};

export default WatchLaterCard;
