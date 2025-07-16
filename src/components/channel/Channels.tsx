import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import { Virtuoso } from "react-virtuoso";
import { FidgetSpinner } from "react-loader-spinner";
import { AnimatePresence, motion } from "framer-motion";

import { useAppSelector } from "../../app/store";

import useAddSubscriberMutation from "../../hooks/useAddSubscriberMutation";
import useDelSubscriberMutation from "../../hooks/useDelSubscriberMutation";
import { usePersistedState } from "../../hooks/usePersistentStorage";

import { rawViewsToString } from "../../utils/functions";

import { ChannelInfoType, TokensType } from "../../types/types";

const ChannelsCard = ({ id }: { id: string }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();

  const subAddMutation = useAddSubscriberMutation({
    kind: channelStats?.items[0]?.kind,
    id: channelStats?.items[0]?.id,
  });

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

  const subDelMutation = useDelSubscriberMutation();

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
            <div className="relative overflow-hidden rounded-full min-w-24 lg:min-w-28 min-h-24 lg:min-h-28">
              {channelStats ? (
                <img
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 object-cover w-full h-full rounded-full"
                  src={
                    channelStats?.items[0]?.snippet?.thumbnails?.default?.url
                  }
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
                {channelStats ? (
                  <div className="font-semibold md:font-bold md:text-lg xl:text-xl text-ellipsis line-clamp-1 lg:line-clamp-2">
                    {channelStats?.items[0]?.snippet?.title}
                  </div>
                ) : (
                  <Skeleton height={16} className="!w-[30vw] rounded-2xl" />
                )}
              </div>

              <div className="flex items-center justify-start gap-1 mt-2">
                <div className="text-xs tracking-tight lg:tracking-wide line-clamp-2 text-zinc-200 text-ellipsis">
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
                    <Skeleton height={10} className="!w-[20vw] rounded-2xl" />
                  )}
                </div>
              </div>

              <div className="w-11/12 mt-1 tracking-tight line-clamp-2 lg:tracking-normal text-ellipsis">
                {channelStats ? (
                  <p className="text-xs text-zinc-400">
                    {channelStats?.items[0]?.snippet?.description}
                  </p>
                ) : (
                  <Skeleton height={20} className="!max-w-[80%] rounded-2xl" />
                )}
              </div>
            </div>
            {window.innerWidth > 640 && (
              <>
                {channelStats ? (
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
    <div className="hideScrollbar overflow-y-auto rounded-xl mb-2 mt-3 max-h-[90vh] h-[70vh] lg:h-[50vh] w-full">
      <div className="relative min-h-full mx-auto lg:w-3/4 xl:w-1/2 hideScrollbar rounded-xl">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
          className="my-3 ml-2 text-lg font-bold sm:text-xl md:text-2xl xl:text-3xl text-slate-200"
        >
          {channelSections[0]?.snippet?.title
            ? channelSections[0]?.snippet?.title
            : "Channels"}
        </motion.h2>
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
