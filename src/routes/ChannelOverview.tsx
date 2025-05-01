import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import Slider from "react-slick";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// import ChannelOverviewCard from "../components/channel/ChannelOverviewCard";
import { useAppSelector } from "../app/store";
// import { useAppDispatch, useAppSelector } from "../app/store";
// import ChannelCard from "../components/channel/ChannelCard";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { TokensType } from "../types/types";
// import { addChannelSection } from "../features/channelSlice";

import { rawViewsToString } from "../utils/functions";

const ChannelOverview = () => {
  //to get sidebar status if its shrunk or expanded
  const isOpen = useAppSelector((state) => state.hamburger);

  // const channel = useAppSelector((state) => state.channel);

  //redux store dispatch
  // const dispatch = useAppDispatch();

  //getting route parameter
  const { channelId } = useParams();

  //custom hook for getting token data from localStorage
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //parts used for API calls
  // const parts = ["contentDetails", "id", "snippet"];

  //query for getting channel sections
  // useQuery({
  //   queryKey: ["channel", channelId],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://youtube.googleapis.com/youtube/v3/channelSections?part=${parts.join(
  //         ","
  //       )}&channelId=${channelId}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Host: "www.googleapis.com",
  //           Authorization: `Bearer ${token?.access_token}`,
  //         },
  //       }
  //     );
  //     const channelSection = await res.json();
  //     dispatch(addChannelSection(channelSection));
  //     return channel;
  //   },
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   enabled: !!channelId,
  // });

  // query for getting channel detail
  const { data: channelDetails } = useQuery({
    queryKey: ["channelDetails", channelId],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${channelId}&part=brandingSettings%2CcontentDetails%2Csnippet%2Cstatistics%2Cstatus&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const channelDetails = await res.json();
      return channelDetails;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!channelId,
  });

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          className={`relative mx-4 mb-2 mt-3 max-h-[90vh] overflow-y-auto hideScrollbar ${
            !isOpen ? "w-[85vw]" : "w-full"
          } `}
        >
          <div className="w-9/12 mx-auto">
            {channelDetails?.items[0]?.brandingSettings?.image && (
              <div className="h-[20vh] overflow-hidden rounded-2xl">
                <img
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                  src={
                    channelDetails?.items[0]?.brandingSettings?.image
                      ?.bannerExternalUrl
                  }
                  alt=""
                />
              </div>
            )}

            <div className="flex items-center justify-start gap-4 pt-4">
              <div className="grid overflow-hidden rounded-full min-w-40 place-items-center">
                {!channelDetails?.items[0]?.snippet ? (
                  <Skeleton className="p-1 aspect-square min-w-40" />
                ) : (
                  <img
                    referrerPolicy="no-referrer"
                    className="w-full h-full"
                    src={
                      channelDetails?.items[0]?.snippet?.thumbnails?.medium?.url
                    }
                    alt=""
                  />
                )}
              </div>
              <div className="flex flex-col min-w-64">
                {!channelDetails?.items[0].snippet ? (
                  <Skeleton className="min-w-full mb-2 min-h-10" />
                ) : (
                  <h1 className="mb-2 text-3xl font-extrabold">
                    {channelDetails?.items[0]?.snippet?.title}
                  </h1>
                )}

                {!channelDetails?.items[0]?.snippet ? (
                  <Skeleton
                    containerClassName="flex gap-2"
                    className="w-10 h-4"
                    count={3}
                  />
                ) : (
                  <span className="flex items-center gap-1 text-zinc-50">
                    <strong>
                      {channelDetails?.items[0]?.snippet?.customUrl}
                    </strong>
                    •
                    <span className="text-sm text-zinc-200">
                      {channelDetails?.items[0]?.statistics &&
                        rawViewsToString(
                          channelDetails?.items[0]?.statistics?.subscriberCount
                        )}{" "}
                      subscribers •
                    </span>
                    <span className="text-sm text-zinc-200">
                      {channelDetails?.items[0]?.statistics &&
                        rawViewsToString(
                          channelDetails?.items[0]?.statistics?.videoCount
                        )}{" "}
                      videos
                    </span>
                  </span>
                )}
                {!channelDetails?.items[0]?.snippet ? (
                  <Skeleton className="mt-4 min-w-40" />
                ) : (
                  <span className="flex justify-start mt-4 cursor-pointer text-zinc-400">
                    <span className="w-1/3 line-clamp-1">
                      {channelDetails?.items[0]?.snippet?.description}
                    </span>
                    {/* open popup with channel description with statistics */}
                    <strong className="font-bold text-white">more</strong>
                  </span>
                )}
                {/* <div className="flex justify-start gap-2">
                  <div className="px-4 py-2 text-sm font-semibold text-center align-middle transition bg-gray-700 rounded-full cursor-pointer focus:bg-gray-600 hover:bg-gray-600">
                    Customise Channel
                  </div>
                  <div className="px-4 py-2 text-sm font-semibold text-center align-middle transition bg-gray-700 rounded-full cursor-pointer focus:bg-gray-600 hover:bg-gray-600">
                    Manage Videos
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="w-full shadow-[0_1px_0_0_rgba(150,150,150,0.5)]">
            <div className="flex items-center w-9/12 gap-5 mx-auto">
              <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
                Videos
              </div>
              <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
                Playlists
              </div>
              <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
                Channels
              </div>
            </div>
          </div>
          <div className="w-9/12 mx-auto">
            <div className="relative"></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default ChannelOverview;
