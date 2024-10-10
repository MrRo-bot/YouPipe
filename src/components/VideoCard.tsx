import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCheckCircle } from "react-icons/md";
import { FcClock, FcStart } from "react-icons/fc";
import { motion } from "framer-motion";

const VideoCard = () => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      className="z-0 p-2 transition-all cursor-pointer group max-w-96 glass rounded-2xl"
    >
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden aspect-[16/9] bg-zinc-200 rounded-2xl">
          <img
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
            <div className="flex items-center gap-1">
              <FcStart className="w-5 h-5" />
              <div className="text-xs tracking-wide text-zinc-400">
                162k views
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FcClock color="black" className="w-5 h-5" />
              <div className="text-xs tracking-wide text-zinc-400">
                12 hours ago
              </div>
            </div>
          </div>
          <div className="text-ellipsis line-clamp-2">
            Columbus Crew vs. Inter Miami CF | 2024 Supporters' Shield Clinched!
            | Full Match Highlights
          </div>
          <div className="flex items-center justify-start gap-1">
            <div className="w-5 h-5 overflow-hidden rounded-full">
              <img
                src="https://yt3.ggpht.com/ytc/AIdro_lmaYOjcRw0-wAZKvvECrErNkHPIFrM7Lc-ntx5nxRGaLo=s68-c-k-c0x00ffffff-no-rj"
                alt=""
              />
            </div>
            <div className="text-xs tracking-wide text-zinc-400 text-ellipsis">
              Major League Soccer <MdCheckCircle className="inline mb-0.5" />
            </div>
            <div className="ml-auto transition hover:scale-105 focus:scale-105">
              <BsThreeDotsVertical />
            </div>
          </div>

          {/* <div className="px-2 py-1 text-sm transition rounded-full cursor-pointer hover:font-bold focus:font-bold glass hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black hover:scale-105 focus:scale-105 w-max">
            Notify Me
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
