import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { usePersistedState } from "../../hooks/usePersistentStorage";
import { rawViewsToString } from "../../utils/functions";
import { ChannelInfoType, SearchType, TokensType } from "../../types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const Channel = ({ search, kind }: { search: SearchType; kind: string }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  const [channelLoading, setChannelLoading] = useState<boolean>(true);
  const [sub, setSub] = useState(false);

  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const parts = ["statistics", "snippet", "contentDetails"];

  const { data: isSubData } = useQuery({
    queryKey: ["isSubscribed?", channelStats?.items[0]?.id],
    queryFn: async () => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${
          channelStats?.items[0]?.id
        }&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const isSubscribed = await res.json();
      setSub(isSubscribed.pageInfo.totalResults ? true : false);
      return isSubscribed;
    },
    enabled: !!channelStats?.items[0]?.id,
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
                kind: search?.id?.kind,
                channelId: search?.id?.channelId,
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

  useEffect(() => {
    (async () => {
      if (kind === "channel") {
        try {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/channels?id=${
              search?.id?.channelId
            }&part=${parts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
            {
              headers: {
                "Content-Type": "application/json",
                Host: "www.googleapis.com",
                Authorization: `Bearer ${token?.access_token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Oh no! didn't get channel data");
          const channel = await res.json();
          setChannelStats(channel);
          setChannelLoading(false);
        } catch (error) {
          setChannelLoading(true);
          toast.error(`${error instanceof Error ? error.message : error}`, {
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
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.id?.channelId]);

  return (
    <div
      className="py-4"
      onClick={() => navigate(`/channel/${channelStats?.items[0]?.id}`)}
    >
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
          className="flex items-center justify-start p-3 transition-all rounded-full cursor-pointer hover:bg-zinc-800/70 glass"
        >
          <div className="relative self-start h-40 mr-4 overflow-hidden rounded-full min-w-40">
            {channelLoading ? (
              <Skeleton height={"100%"} className="-top-1" />
            ) : (
              <>
                <img
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                  src={channelStats?.items[0]?.snippet?.thumbnails?.high?.url}
                  alt=""
                />
              </>
            )}
          </div>
          <div className="flex flex-col mr-4 flex-start">
            {channelLoading ? (
              <Skeleton width={300} height={27} className="top-2 rounded-2xl" />
            ) : (
              <h3 className="w-full text-2xl font-semibold text-ellipsis line-clamp-2">
                {channelStats?.items[0]?.snippet?.title || ""}
              </h3>
            )}

            <div className="flex items-center gap-2 pt-1 text-sm font-medium text-zinc-300">
              {channelLoading ? (
                <Skeleton
                  width={150}
                  height={20}
                  className="top-5 rounded-2xl"
                />
              ) : (
                `${
                  channelStats?.items
                    ? channelStats?.items[0]?.snippet?.customUrl
                    : ""
                } • ${
                  channelStats?.items
                    ? rawViewsToString(
                        channelStats?.items[0]?.statistics?.subscriberCount ||
                          ""
                      )
                    : "unknown"
                } subscribers • ${
                  channelStats?.items
                    ? rawViewsToString(
                        channelStats?.items[0]?.statistics?.viewCount || ""
                      )
                    : "unknown"
                } views • ${
                  channelStats?.items
                    ? rawViewsToString(
                        channelStats?.items[0]?.statistics?.videoCount || ""
                      )
                    : "unknown"
                } videos`
              )}
            </div>

            {channelLoading ? (
              <Skeleton width={150} height={20} className="top-5 rounded-2xl" />
            ) : (
              <div className="w-11/12 pt-2 text-sm text-ellipsis line-clamp-2 text-zinc-400">
                {channelStats?.items[0]?.snippet?.description}
              </div>
            )}
          </div>
          {channelLoading ? (
            <div className="ml-auto">
              <Skeleton width={110} height={30} className="!rounded-full" />
            </div>
          ) : (
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
                onClick={() =>
                  isSubData?.pageInfo?.totalResults &&
                  subDelMutation.mutate(isSubData?.items[0]?.id)
                }
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
          )}
        </motion.div>
      </SkeletonTheme>
    </div>
  );
};

export default Channel;
