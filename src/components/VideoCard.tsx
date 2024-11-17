import { useState } from "react";
import { motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FcClock, FcStart } from "react-icons/fc";

const VideoCard = () => {
  //skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
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
          <div className="relative overflow-hidden aspect-video rounded-2xl">
            {
              <>
                <img
                  onLoad={() => setIsImgLoaded(!isImgLoaded)}
                  src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=480"
                  alt=""
                  className="object-fill transition group-hover:scale-110 group-focus:scale-110"
                />
                <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
                  2:30
                </div>
              </>
            }
            {!isImgLoaded && (
              <Skeleton
                width={"100%"}
                height={"100%"}
                className="-top-1 rounded-2xl"
              />
            )}
          </div>
          <div className="flex flex-col gap-3 px-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <FcStart className="w-5 h-5" />
                {isImgLoaded ? (
                  <div className="text-xs tracking-wide text-zinc-400">
                    162k views
                  </div>
                ) : (
                  <Skeleton width={100} className="rounded-2xl" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <FcClock color="black" className="w-5 h-5" />
                {isImgLoaded ? (
                  <div className="text-xs tracking-wide text-zinc-400">
                    12 hours ago
                  </div>
                ) : (
                  <Skeleton width={100} className="rounded-2xl" />
                )}
              </div>
            </div>
            {isImgLoaded ? (
              <div className="text-ellipsis line-clamp-2">Some Title</div>
            ) : (
              <Skeleton width={100} className="rounded-2xl" />
            )}
            <div className="flex items-center justify-start gap-1">
              <div className="grid w-5 h-5 overflow-hidden rounded-full place-items-center">
                {isImgLoaded && (
                  <img
                    className="w-full h-full rounded-full"
                    src="https://yt3.ggpht.com/ytc/AIdro_lmaYOjcRw0-wAZKvvECrErNkHPIFrM7Lc-ntx5nxRGaLo=s68-c-k-c0x00ffffff-no-rj"
                    alt=""
                  />
                )}

                {!isImgLoaded && (
                  <Skeleton width={20} height={20} circle className="-top-1" />
                )}
              </div>
              {isImgLoaded ? (
                <>
                  <div className="text-xs tracking-wide text-zinc-400 text-ellipsis">
                    Channel Name
                  </div>
                  <div className="ml-auto transition hover:scale-105 focus:scale-105">
                    <PiDotsThreeOutlineVerticalFill />
                  </div>
                </>
              ) : (
                <Skeleton width={100} className="rounded-2xl" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default VideoCard;
