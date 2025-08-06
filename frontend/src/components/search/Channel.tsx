import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import useAddSubscriberMutation from "../../hooks/useAddSubscriberMutation";
import useDelSubscriberMutation from "../../hooks/useDelSubscriberMutation";
import { usePersistedState } from "../../hooks/usePersistentStorage";

import { rawViewsToString } from "../../utils/functions";
import customToastFunction from "../../utils/Toastify";

import { ChannelInfoType, SearchType, TokensType } from "../../types/types";

const Channel = ({ search, kind }: { search: SearchType; kind: string }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  const [channelLoading, setChannelLoading] = useState<boolean>(true);
  const [sub, setSub] = useState(false);

  const navigate = useNavigate();

  const subDelMutation = useDelSubscriberMutation();
  const subAddMutation = useAddSubscriberMutation({
    kind: search?.id?.kind,
    id: search?.id?.channelId,
  });

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
    queryKey: ["channelSubCheck", channelStats?.items[0]?.id],
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
          if (!res.ok && res.status >= 400)
            throw new Error(`Error ${res.status} in getting channel data`);
          const channel = await res.json();
          setChannelStats(channel);
          setChannelLoading(false);
        } catch (error) {
          setChannelLoading(true);
          customToastFunction(
            `${error instanceof Error ? error.message : error}`,
            "error"
          );
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.id?.channelId]);

  const handleDelSub = () => {
    if (window.confirm("Are you sure you want to unsubscribe 😿?")) {
      if (isSubData?.pageInfo?.totalResults) {
        subDelMutation.mutate(isSubData?.items[0]?.id);
        setSub(false);
      }
    }
  };

  return (
    <div
      className="py-2"
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
          className="flex items-center justify-start p-1 transition-colors rounded-full cursor-pointer md:p-3 glass hover:bg-indigo-600/20 focus:bg-indigo-600/20"
        >
          <div className="relative mr-2 overflow-hidden rounded-full md:mr-4 min-w-24 lg:min-w-28 xl:min-w-32 min-h-24 lg:min-h-28 xl:min-h-32">
            {channelLoading ? (
              <Skeleton
                circle={true}
                height="100%"
                containerClassName="absolute inset-0 -top-1"
              />
            ) : (
              <img
                referrerPolicy="no-referrer"
                className="absolute inset-0 object-cover w-full h-full rounded-full"
                src={channelStats?.items[0]?.snippet?.thumbnails?.default?.url}
                alt=""
              />
            )}
          </div>

          <div className="flex flex-col mr-2 md:mr-4 flex-start">
            {channelLoading ? (
              <Skeleton className="h-5 !w-[30vw] rounded-2xl" />
            ) : (
              <h3 className="w-full text-lg font-semibold lg:text-xl xl:text-2xl text-ellipsis line-clamp-2 text-zinc-50">
                {channelStats?.items[0]?.snippet?.title || ""}
              </h3>
            )}

            <div className="flex items-center gap-2 pt-1 text-xs font-medium md:text-sm text-zinc-200">
              {channelLoading ? (
                <Skeleton className="rounded-2xl h-6 !w-[6vw]" />
              ) : window.innerWidth > 540 ? (
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
              ) : (
                `${
                  channelStats?.items
                    ? channelStats?.items[0]?.snippet?.customUrl
                    : ""
                } ${
                  channelStats?.items
                    ? rawViewsToString(
                        channelStats?.items[0]?.statistics?.subscriberCount ||
                          ""
                      )
                    : "unknown"
                } subs`
              )}
            </div>

            {window.innerWidth > 540 && (
              <>
                {channelLoading ? (
                  <Skeleton className="h-8 !w-[20vw] rounded-2xl" />
                ) : (
                  <div className="w-11/12 pt-2 text-sm text-ellipsis line-clamp-2 text-zinc-400">
                    {channelStats?.items[0]?.snippet?.description}
                  </div>
                )}
              </>
            )}
          </div>
          {channelLoading ? (
            <div className="ml-auto">
              <Skeleton className="h-8 !w-[6vw] !rounded-full" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`flex justify-center min-w-24 sm:min-w-28 text-sm md:text-base overflow-hidden p-1 md:px-3 md:py-2 mt-1 ml-auto font-medium transition-colors rounded-full cursor-pointer select-none 
                  ${
                    sub
                      ? "bg-zinc-800 hover:bg-zinc-600/70 focus:bg-zinc-600/70 active:bg-zinc-600/70 "
                      : "bg-white text-black hover:bg-zinc-200/70 focus:bg-zinc-200/70 active:bg-zinc-200/70"
                  } `}
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
          )}
        </motion.div>
      </SkeletonTheme>
    </div>
  );
};

export default Channel;
