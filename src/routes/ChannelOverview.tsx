import { NavLink, Outlet, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { useAppDispatch, useAppSelector } from "../app/store";
import {
  addChannelDetails,
  addChannelSections,
} from "../features/channelOverviewSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { rawViewsToString } from "../utils/functions";
import { TokensType } from "../types/types";

const ChannelOverview = () => {
  const { channelId } = useParams();

  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.hamburger);
  const channelDetails = useAppSelector(
    (state) => state.channelOverview.channelDetails
  );

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const sectionParts = ["contentDetails", "id", "snippet"];

  useQuery({
    queryKey: ["channelSections", channelId],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channelSections?part=${sectionParts.join(
          ","
        )}&channelId=${channelId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const channelSection = await res.json();
      dispatch(addChannelSections(channelSection));
      return channelSection;
    },
    refetchOnWindowFocus: false,
    enabled: !!channelId,
  });

  const channelParts = [
    "brandingSettings",
    "contentDetails",
    "snippet",
    "statistics",
    "status",
  ];

  const { isLoading } = useQuery({
    queryKey: ["channelDetails", channelId],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${channelId}&part=${channelParts.join(
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
      const channelDetails = await res.json();
      dispatch(addChannelDetails(channelDetails));
      return channelDetails;
    },
    refetchOnWindowFocus: false,
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
            {channelDetails?.items[0]?.brandingSettings?.image
              ?.bannerExternalUrl ? (
              isLoading ? (
                <div className="h-[20vh] overflow-hidden rounded-2xl">
                  <Skeleton className="object-cover w-full h-full pt-1"></Skeleton>
                </div>
              ) : (
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
              )
            ) : (
              <div></div>
            )}

            <div className="flex items-center justify-start gap-4 pt-4">
              <div className="grid overflow-hidden rounded-full max-w-40 place-items-center">
                {isLoading ? (
                  <Skeleton className="pt-1 aspect-square" />
                ) : (
                  <img
                    referrerPolicy="no-referrer"
                    className=""
                    src={
                      channelDetails?.items[0]?.snippet?.thumbnails?.high?.url
                    }
                    alt=""
                  />
                )}
              </div>
              <div className="flex flex-col min-w-64">
                {isLoading ? (
                  <Skeleton className="min-w-full mb-2 min-h-10" />
                ) : (
                  <h1 className="mb-2 text-3xl font-extrabold">
                    {channelDetails?.items[0]?.snippet?.title}
                  </h1>
                )}

                {isLoading ? (
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
                {isLoading ? (
                  <Skeleton className="mt-4 min-w-40" />
                ) : (
                  <span className="flex justify-start mt-4 cursor-pointer text-zinc-400">
                    <span className="max-w-[50%] line-clamp-1">
                      {channelDetails?.items[0]?.snippet?.description}
                    </span>
                    {/* open popup with channel description with statistics */}
                    <strong className="font-bold text-white">...more</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full mb-2 shadow-[0_1px_0_0_rgba(150,150,150,0.5)]">
            <div className="flex items-center w-9/12 gap-3 pt-4 pb-2 mx-auto">
              <NavLink
                to=""
                className={({ isActive }) =>
                  isActive ? "text-black bg-white rounded-md" : ""
                }
                end
              >
                <div className="flex flex-col items-center gap-1 px-2 py-1 text-center transition-colors ease-in-out rounded-md cursor-pointer hover:bg-zinc-400 focus:bg-zinc-400 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
                  Home
                </div>
              </NavLink>
              <NavLink
                to="channels"
                className={({ isActive }) =>
                  isActive ? "text-black bg-white rounded-md" : ""
                }
                end
              >
                <div className="flex flex-col items-center gap-1 px-2 py-1 text-center transition-colors ease-in-out rounded-md cursor-pointer hover:bg-zinc-400 focus:bg-zinc-400 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
                  Channels
                </div>
              </NavLink>
              <NavLink
                to="playlists"
                className={({ isActive }) =>
                  isActive ? "text-black bg-white rounded-md" : ""
                }
                end
              >
                <div className="flex flex-col items-center gap-1 px-2 py-1 text-center transition-colors ease-in-out rounded-md cursor-pointer hover:bg-zinc-400 focus:bg-zinc-400 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
                  Playlists
                </div>
              </NavLink>
            </div>
          </div>
          <div className="w-9/12 mx-auto">
            <Outlet />
          </div>
        </motion.div>
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default ChannelOverview;
