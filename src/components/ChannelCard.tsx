import { motion } from "framer-motion";
import {
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdNotificationsActive,
} from "react-icons/md";

const ChannelCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: "all" }}
      className="flex items-center gap-1 p-3 transition-transform glass scale hover:scale-[1.01] focus:scale-[1.01]"
    >
      <div>
        <img
          className="rounded-full min-w-32 min-h-32"
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
        <div className="flex items-center gap-2 px-3 py-2 font-medium bg-zinc-800 rounded-full cursor-pointer max-w-max">
          <MdNotificationsActive className="w-5 h-5" /> Subscribed
          <MdKeyboardArrowDown className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelCard;
