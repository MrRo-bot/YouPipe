import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Virtuoso } from "react-virtuoso";
import { FidgetSpinner } from "react-loader-spinner";
import { AnimatePresence, motion } from "framer-motion";

import { useAppSelector } from "../../app/store";

import { ChannelInfoType, TokensType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { usePersistedState } from "../../hooks/usePersistentStorage";
import { Bounce, toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { rawViewsToString } from "../../utils/functions";

const ChannelsCard = ({ id }: { id: string }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();

  const [sub, setSub] = useState<boolean>();

  const navigate = useNavigate();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

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

  const subDelMutation = useMutation({
    mutationFn: async (unSubId: string | undefined) => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${unSubId}&key=${
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
            Authorization: `Bearer ${token?.access_token}`,
          },
          body: JSON.stringify({
            snippet: {
              resourceId: {
                kind: channelStats?.items[0]?.kind,
                channelId: channelStats?.items[0]?.id,
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

  const handleDelSub = () => {
    if (window.confirm("Are you sure you want to unsubscribe 😿?")) {
      subDelMutation.mutate(isSubData?.items[0]?.id);
      setSub(false);
    }
  };

  const parts = ["statistics", "snippet"];

  useQuery({
    queryKey: ["channelStats", id],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${id}&part=${parts.join(
          ","
        )}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const channel = await res.json();
      setChannelStats(channel);
      return channel;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <div className="py-2">
        <motion.div
          onClick={() =>
            navigate(`/channel/${channelStats && channelStats.items[0].id}`)
          }
          variants={{
            hidden: { scale: 0.95 },
            visible: { scale: 1 },
          }}
          initial={"hidden"}
          whileInView={"visible"}
          className="z-0 p-2 transition-colors rounded-full cursor-pointer hover:bg-indigo-600/20 focus:bg-indigo-600/20 group glass"
        >
          <div className="flex items-center justify-start gap-4">
            <div className="w-36 grid object-cover aspect-square rounded-full overflow-hidden cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
              {channelStats ? (
                <img
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full"
                  src={
                    channelStats?.items[0]?.snippet?.thumbnails?.default?.url
                  }
                  alt=""
                />
              ) : (
                <Skeleton className="!w-36 !h-36 !rounded-full -top-2" />
              )}
            </div>

            <div className="flex flex-col items-start w-9/12 px-1">
              <div className="flex items-center gap-1">
                {channelStats ? (
                  <div className="text-xl text-ellipsis line-clamp-2">
                    {channelStats?.items[0]?.snippet?.title}
                  </div>
                ) : (
                  <Skeleton width={100} height={20} className="rounded-2xl" />
                )}
              </div>

              <div className="flex items-center justify-start gap-1 mt-2">
                <div className="text-xs tracking-wide line-clamp-2 text-zinc-200 text-ellipsis">
                  {channelStats ? (
                    `${
                      channelStats?.items[0]?.snippet?.customUrl
                    } • ${rawViewsToString(
                      channelStats?.items[0]?.statistics?.subscriberCount || ""
                    )} Subs • ${rawViewsToString(
                      channelStats?.items[0]?.statistics?.viewCount || ""
                    )} views • ${rawViewsToString(
                      channelStats?.items[0]?.statistics?.videoCount || ""
                    )} videos`
                  ) : (
                    <Skeleton width={300} height={10} className="rounded-2xl" />
                  )}
                </div>
              </div>

              <div className="w-11/12 mt-1 line-clamp-2 text-ellipsis">
                {channelStats ? (
                  <p className="text-xs text-zinc-400">
                    {channelStats?.items[0]?.snippet?.description}
                  </p>
                ) : (
                  <Skeleton width={400} height={20} className="rounded-2xl" />
                )}
              </div>
            </div>
            {channelStats ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`grid place-items-center overflow-hidden px-3 py-2 mt-1 w-32 h-10 ml-auto font-medium transition-colors rounded-full cursor-pointer select-none
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
          </div>
        </motion.div>
      </div>
    </SkeletonTheme>
  );
};

const Channels = () => {
  const channelSections = useAppSelector((state) =>
    state.channelOverview.channelSections.items.filter(
      (channelSection) =>
        channelSection?.contentDetails &&
        channelSection?.contentDetails?.channels
    )
  );

  const channelsList = channelSections[0]?.contentDetails?.channels;

  return (
    <div className="hideScrollbar overflow-y-auto rounded-xl mb-2 mt-3 max-h-[90vh] h-[50vh] w-full">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
        className="my-3 ml-2 text-3xl font-bold text-slate-200"
      >
        {channelSections[0]?.snippet?.title
          ? channelSections[0]?.snippet?.title
          : "Channels"}
      </motion.h2>
      <div className="relative w-3/4 min-h-full mx-auto hideScrollbar rounded-xl">
        {!channelsList ? (
          <FidgetSpinner
            visible={true}
            height="80"
            width="80"
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper mx-auto translate-y-1/2 -top-1/2"
          />
        ) : (
          <Virtuoso
            className="!flex !flex-col !overflow-y-auto !min-h-[75vh] !hideScrollbar"
            increaseViewportBy={100}
            data={channelsList}
            totalCount={channelsList.length}
            itemContent={(_, data) => <ChannelsCard key={data} id={data} />}
          />
        )}
      </div>
    </div>
  );
};

export default Channels;
