import { motion } from "framer-motion";
import {
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdNotificationsActive,
} from "react-icons/md";

const ChannelCard = () => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      className="flex items-center gap-1 p-3 transition-all glass"
    >
      <div className="grid place-items-center min-w-32 min-h-32">
        <img
          className="w-full h-full rounded-full"
          src="https://yt3.ggpht.com/ytc/AIdro_lmaYOjcRw0-wAZKvvECrErNkHPIFrM7Lc-ntx5nxRGaLo=s68-c-k-c0x00ffffff-no-rj"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-1 ml-3 flex-start">
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-medium">Samay Raina</h3>
          <MdCheckCircle className="inline mb-0.5" />
        </div>
        <span className="text-sm text-zinc-400">
          @samayraina • 1.7M subscribers
        </span>
        <p className="text-sm line-clamp-2 text-zinc-400">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt
          tenetur cumque voluptas quas maxime possimus? Molestiae hic a eveniet
          iste veritatis, vel asperiores officiis impedit officia expedita
          explicabo corporis mollitia.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-2 px-3 py-2 font-medium rounded-full cursor-pointer bg-zinc-800 max-w-max">
          <MdNotificationsActive className="w-5 h-5" /> Subscribed
          <MdKeyboardArrowDown className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelCard;
