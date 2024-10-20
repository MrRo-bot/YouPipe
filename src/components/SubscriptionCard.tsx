import { motion } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiBellRingingFill, PiCheckCircleFill } from "react-icons/pi";

const SubscriptionCard = () => {
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
      <div className="flex items-center gap-4">
        <div className="transition grid max-w-40 aspect-square rounded-full overflow-hidden cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
          <img className="p-2" src="icon.svg" alt="profile" />
        </div>
        <div className="flex flex-col gap-3 px-1">
          <div className="flex items-center gap-1">
            <div className="text-2xl text-ellipsis line-clamp-2">
              Some Title
            </div>
            <div className="transition hover:scale-105 focus:scale-105">
              <PiCheckCircleFill className="inline mb-0.5" />
            </div>
          </div>

          <div className="flex items-center justify-start gap-1">
            <div className="text-xs tracking-wide text-zinc-400 text-ellipsis">
              @channelname123 • 123k Subscribers
            </div>
          </div>

          <div className="w-5/6 line-clamp-2 text-ellipsis">
            <p className="text-xs text-zinc-400">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet
              alias numquam accusantium voluptatibus culpa laudantium, magni,
              pariatur aliquid consectetur nam inventore molestiae qui nesciunt?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 font-medium rounded-full cursor-pointer bg-zinc-800 max-w-max">
          <PiBellRingingFill className="w-5 h-5" /> Subscribed{" "}
          <MdKeyboardArrowDown />
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
