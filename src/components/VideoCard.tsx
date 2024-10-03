import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCheckCircle } from "react-icons/md";

const VideoCard = () => {
  return (
    <div className="grid">
      <div className="p-0.5 w-2/5">
        <div className="flex flex-col gap-3">
          <div className="object-cover overflow-hidden aspect-[16/10] bg-zinc-200 rounded-2xl">
            <img
              className=""
              src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            />
          </div>
          <div className="flex gap-2">
            <div>
              <div className="w-10 h-10 mt-1.5 overflow-hidden rounded-full">
                <img
                  src="https://yt3.ggpht.com/ytc/AIdro_lmaYOjcRw0-wAZKvvECrErNkHPIFrM7Lc-ntx5nxRGaLo=s68-c-k-c0x00ffffff-no-rj"
                  alt=""
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mt-0.5 mb-2 font-semibold font-kode text-ellipsis line-clamp-2">
                Columbus Crew vs. Inter Miami CF | 2024 Supporters' Shield
                Clinched! | Full Match Highlights
              </div>
              <div className="text-sm font-medium text-zinc-600">
                Major League Soccer <MdCheckCircle className="inline mb-1" />
              </div>
              <div className="text-sm mt-0.5 font-medium text-zinc-600">
                162k views • 12 hours ago
              </div>
              <div className="mt-3">
                <div className="px-2 py-1 rounded-full bg-zinc-200 w-max">
                  Notify Me
                </div>
              </div>
            </div>
            <div>
              <BsThreeDotsVertical className="mt-1.5" size={1.1 + "em"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
