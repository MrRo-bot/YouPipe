import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCheckCircle } from "react-icons/md";

import { FcStart } from "react-icons/fc";

const VideoCard = () => {
  return (
    <div className="z-0 p-1 cursor-pointer max-w-96 glass rounded-2xl shadow-cardShadow">
      <div className="flex flex-col gap-4">
        <div className="object-cover overflow-hidden aspect-[16/9] bg-zinc-200 rounded-2xl">
          <img
            src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1"
            alt=""
          />
        </div>
        <div className="flex flex-col gap-3 px-2">
          <div className="flex justify-between">
            <div className="flex">
              <FcStart />
              <div className="text-xs font-medium tracking-wide text-zinc-400">
                162k views
              </div>
            </div>
            <div>
              <div className="text-xs font-medium tracking-wide text-zinc-400">
                12 hours ago
              </div>
            </div>
          </div>
          <div className="text-sm font-bold tracking-wide font-heading text-ellipsis line-clamp-2">
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
            <div className="text-xs font-medium text-zinc-400 text-ellipsis">
              Major League Soccer <MdCheckCircle className="inline mb-0.5" />
            </div>
            <div className="ml-auto">
              <BsThreeDotsVertical size={1.1 + "em"} className="mb-0.5" />
            </div>
          </div>

          {/* <div className="px-2 py-1 text-sm transition-all rounded-full cursor-pointer hover:font-bold focus:font-bold glass hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black hover:scale-105 focus:scale-105 w-max">
            Notify Me
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
