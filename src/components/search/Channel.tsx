import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { usePersistedState } from "../../hooks/usePersistentStorage";
import { rawViewsToString } from "../../utils/functions";
import { ChannelInfoType, SearchType, TokensType } from "../../types/types";

const Channel = ({ search, kind }: { search: SearchType; kind: string }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  const [channelLoading, setChannelLoading] = useState<boolean>(true);

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
          <div
            onClick={(e) => {
              e.stopPropagation();
              console.log("subscriber button");
            }}
            className="self-center px-4 py-2 mx-auto font-medium rounded-full cursor-pointer bg-zinc-800"
          >
            Subscribed
          </div>
        </motion.div>
      </SkeletonTheme>
    </div>
  );
};

export default Channel;
