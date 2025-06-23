import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import { rawViewsToString } from "../../utils/functions";

import { ChannelInfoType, TokensType } from "../../types/types";

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

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const subDelMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${id}&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error removing subscriber");
    },
    onSuccess: async () => {
      toast("🥲 Unsubscribed!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      });
    },
    onError: (e) => {
      toast.error(`🤔 ${e.message}`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradientError !font-bold !text-zinc-50",
        transition: Bounce,
      });
    },
  });
  const subAddMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
          body: JSON.stringify({
            snippet: {
              resourceId: {
                kind: subRes?.kind,
                channelId: subRes?.channelId,
              },
            },
          }),
        }
      );
      if (!res.ok) throw new Error("Error subscribing to user");
    },
    onSuccess: async () => {
      toast("🥳 Subscribed", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      });
    },
    onError: (e) => {
      toast.error(`🤔 ${e.message}`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradientError !font-bold !text-zinc-50",
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
        onClick={() => navigate(`/channel/${stat && stat.items[0].id}`)}
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
            {stat ? (
              <img
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full"
                src={stat?.items[0]?.snippet?.thumbnails?.high?.url}
                alt=""
              />
            ) : (
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
              {stat ? (
                <div className="text-xl text-ellipsis line-clamp-2">
                  {stat?.items[0]?.snippet?.title}
                </div>
              ) : (
                <Skeleton width={100} height={20} className="rounded-2xl" />
              )}
            </div>

            <div className="flex items-center justify-start gap-1 mt-2">
              <div className="text-xs tracking-wide line-clamp-2 text-zinc-200 text-ellipsis">
                {stat ? (
                  `${stat?.items[0]?.snippet?.customUrl} • ${rawViewsToString(
                    stat?.items[0]?.statistics?.subscriberCount || ""
                  )} Subs • ${rawViewsToString(
                    stat?.items[0]?.statistics?.viewCount || ""
                  )} views • ${rawViewsToString(
                    stat?.items[0]?.statistics?.videoCount || ""
                  )} videos`
                ) : (
                  <Skeleton width={300} height={10} className="rounded-2xl" />
                )}
              </div>
            </div>

            <div className="w-11/12 mt-1 line-clamp-2 text-ellipsis">
              {stat ? (
                <p className="text-xs text-zinc-400">
                  {stat?.items[0]?.snippet?.description}
                </p>
              ) : (
                <p className="text-xs text-zinc-400">No Description Found</p>
              )}
            </div>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setSub(!sub);
            }}
            className={`grid px-3 py-2 mt-1 ml-auto font-medium transition-all rounded-full cursor-pointer select-none 
           ${
             sub ? "bg-zinc-800" : "bg-white text-black"
           } active:bg-zinc-600/70`}
          >
            <span
              onClick={() => {
                subDelMutation.mutate(subId);
              }}
              className={`col-start-1 row-start-1 mx-auto ${
                !sub ? "invisible" : ""
              } `}
            >
              Subscribed
            </span>
            <span
              onClick={() => {
                subAddMutation.mutate();
              }}
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
