import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import useAddSubscriberMutation from "../../hooks/useAddSubscriberMutation";

import { rawViewsToString } from "../../utils/functions";

import { ChannelInfoType } from "../../types/types";
import useDelSubscriberMutation from "../../hooks/useDelSubscriberMutation";

const SubscriptionCard = ({
  stat,
  subId,
  subRes,
}: {
  stat: ChannelInfoType;
  subId: string;
  subRes: { kind: string; channelId: string } | undefined;
}) => {
  const [sub, setSub] = useState(true);

  const navigate = useNavigate();

  const subAddMutation = useAddSubscriberMutation({
    kind: subRes?.kind,
    id: subRes?.channelId,
  });

  const subDelMutation = useDelSubscriberMutation();

  const handleDelSub = () => {
    if (window.confirm("Are you sure you want to unsubscribe 😿?")) {
      subDelMutation.mutate(subId);
      setSub(false);
    }
  };

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <motion.div
        onClick={() => navigate(`/channel/${stat && stat.items[0].id}`)}
        variants={{
          hidden: { scale: 0.95 },
          visible: { scale: 1 },
        }}
        initial={"hidden"}
        whileInView={"visible"}
        className="z-0 p-2 transition-colors rounded-full cursor-pointer hover:bg-indigo-600/20 focus:bg-indigo-600/20 group glass"
      >
        <div className="flex items-center justify-start gap-2 md:gap-4">
          <div className="relative overflow-hidden rounded-full min-w-20 lg:min-w-28 xl:min-w-32 min-h-20 lg:min-h-28 xl:min-h-32">
            !{" "}
            {stat ? (
              <img
                referrerPolicy="no-referrer"
                className="absolute inset-0 object-cover w-full h-full rounded-full"
                src={stat?.items[0]?.snippet?.thumbnails?.default?.url}
                alt=""
              />
            ) : (
              <Skeleton
                className="absolute inset-0 w-full h-full"
                circle={true}
                height="100%"
                containerClassName="absolute inset-0"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-9/12 px-1">
            <div className="flex items-center gap-1">
              {stat ? (
                <div className="font-semibold md:font-bold md:text-lg xl:text-xl text-ellipsis line-clamp-1 lg:line-clamp-2">
                  {stat?.items[0]?.snippet?.title}
                </div>
              ) : (
                <Skeleton height={16} className="!w-[20vw] rounded-2xl" />
              )}
            </div>

            <div className="flex items-center justify-start gap-1 mt-2">
              <div className="text-xs tracking-tight lg:tracking-wide line-clamp-2 text-zinc-200 text-ellipsis">
                {stat ? (
                  `${stat?.items[0]?.snippet?.customUrl} • ${rawViewsToString(
                    stat?.items[0]?.statistics?.subscriberCount || ""
                  )} Subs • ${rawViewsToString(
                    stat?.items[0]?.statistics?.viewCount || ""
                  )} views • ${rawViewsToString(
                    stat?.items[0]?.statistics?.videoCount || ""
                  )} videos`
                ) : (
                  <Skeleton height={10} className="!w-[15vw] rounded-2xl" />
                )}
              </div>
            </div>

            <div className="w-11/12 mt-1 tracking-tight line-clamp-2 lg:tracking-normal text-ellipsis">
              {stat ? (
                <p className="text-xs text-zinc-400">
                  {stat?.items[0]?.snippet?.description}
                </p>
              ) : (
                <Skeleton height={20} className="!w-[17vw] rounded-2xl" />
              )}
            </div>
          </div>
          {window.outerWidth > 640 && (
            <>
              {stat ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`grid place-items-center overflow-hidden px-3 py-2 mt-1 text-sm md:text-base w-28 md:w-32 h-10 ml-auto font-medium transition-colors rounded-full cursor-pointer select-none
                  ${
                    sub
                      ? "bg-zinc-800 hover:bg-zinc-600/70 focus:bg-zinc-600/70 active:bg-zinc-600/70"
                      : "bg-white text-black hover:bg-zinc-200/70 focus:bg-zinc-200/70 active:bg-zinc-200/70"
                  }
                  `}
                >
                  <AnimatePresence>
                    {sub ? (
                      <motion.span
                        key="subscribed"
                        initial={{ opacity: 0, x: -100, rotate: -45 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        onClick={handleDelSub}
                      >
                        Subscribed
                      </motion.span>
                    ) : (
                      <motion.span
                        key="subscribe"
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        onClick={() => {
                          setSub(true);
                          subAddMutation.mutate();
                        }}
                      >
                        Subscribe
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Skeleton width={110} height={30} className="!rounded-full" />
              )}
            </>
          )}
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default SubscriptionCard;
