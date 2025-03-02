import { useState } from "react";
import { motion } from "framer-motion";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ChannelInfoType, TokensType } from "../../types/types";
import { rawViewsToString } from "../../utils/functions";
import { useMutation } from "@tanstack/react-query";
import { usePersistedState } from "../../hooks/usePersistentStorage";
import { deleteSubscription } from "../../features/subscriptionSlice";
import { useAppDispatch } from "../../app/store";

const SubscriptionCard = ({
  stat,
  subId,
}: {
  stat: ChannelInfoType;
  subId: string;
}) => {
  //skeleton loading before image is loaded
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [sub, setSub] = useState(true);

  //token from localStorage
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const dispatch = useAppDispatch();
  const snippet = stat?.items[0]?.snippet;
  const statistics = stat?.items[0]?.statistics;

  //deleting subscription
  const subMutation = useMutation({
    mutationFn: (sub: string) => {
      return fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${sub}&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
    },
    onSuccess: async () => {
      toast("🥲 Unsubscribed!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (e) => {
      toast(`🤔 ${e}`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

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
        className="z-0 p-2 transition-all rounded-full cursor-pointer group glass"
      >
        <div className="flex items-center justify-start gap-4">
          <div className="transition w-36 grid object-cover aspect-square rounded-full overflow-hidden cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            {snippet?.thumbnails && (
              <img
                referrerPolicy="no-referrer"
                onLoad={() => setIsImgLoaded(!isImgLoaded)}
                className="w-full h-full rounded-full"
                src={snippet?.thumbnails?.high?.url}
                alt=""
              />
            )}

            {!isImgLoaded && (
              <Skeleton
                circle
                width={135}
                height={135}
                className="-top-2 -left-1"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-9/12 px-1">
            <div className="flex items-center gap-1">
              {!snippet?.title ? (
                <Skeleton width={100} height={20} className="rounded-2xl" />
              ) : (
                <div className="text-xl text-ellipsis line-clamp-2">
                  {snippet?.title}
                </div>
              )}
            </div>

            <div className="flex items-center justify-start gap-1 mt-4">
              <div className="text-xs tracking-wide line-clamp-2 text-zinc-200 text-ellipsis">
                {!statistics ? (
                  <Skeleton width={300} height={10} className="rounded-2xl" />
                ) : (
                  `${snippet?.customUrl} • ${rawViewsToString(
                    statistics && statistics?.subscriberCount
                  )} Subs • ${rawViewsToString(
                    statistics && statistics?.viewCount
                  )} views • ${rawViewsToString(
                    statistics && statistics?.videoCount
                  )} videos`
                )}
              </div>
            </div>

            <div className="w-11/12 mt-1 line-clamp-2 text-ellipsis">
              {!snippet?.description ? (
                <p className="text-xs text-zinc-400"></p>
              ) : (
                <p className="text-xs text-zinc-400">{snippet?.description}</p>
              )}
            </div>
          </div>

          <div
            onClick={() => {
              setSub(!sub);
            }}
            className={`grid px-3 py-2 mt-1 ml-auto font-medium transition-all rounded-full cursor-pointer select-none
           ${
             sub ? "bg-zinc-800" : "bg-white text-black"
           } active:bg-zinc-600/70`}
          >
            <span
              onClick={() => {
                subMutation.mutate(subId);
                dispatch(deleteSubscription(subId));
              }}
              className={`col-start-1 row-start-1 mx-auto ${
                !sub ? "invisible" : ""
              } `}
            >
              Subscribed
            </span>
            <span
              className={`col-start-1 row-start-1 mx-auto ${
                sub ? "invisible" : ""
              } `}
            >
              Subscribe
            </span>
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default SubscriptionCard;
