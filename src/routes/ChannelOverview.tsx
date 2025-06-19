import { useRef } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useAppDispatch, useAppSelector } from "../app/store";
import {
  addChannelDetails,
  addChannelSections,
} from "../features/channelOverviewSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { formatDate, rawViewsToString } from "../utils/functions";
import { TokensType } from "../types/types";
import {
  PiArrowBendRightUpFill,
  PiGlobeFill,
  PiInfoFill,
  PiMailboxFill,
  PiPlusBold,
  PiUserListFill,
  PiVideoFill,
} from "react-icons/pi";

const ChannelOverview = () => {
  const descRef = useRef<HTMLDialogElement>(null);
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

  const mailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/g;

  const linkRegex =
    /(?:https?:\/\/|www\.)[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]/gi;

  const replacer = (match: string) => {
    // Remove http:// or https:// if present, otherwise return match unchanged
    return match.replace(/^https?:\/\//, "");
  };

  const findingLinks =
    channelDetails?.items[0]?.snippet?.localized?.description.replace(
      linkRegex,
      (match: string) => {
        const url = replacer(match);
        // Basic sanitization to prevent XSS (use a library like DOMPurify in production)
        const sanitizedUrl = url.replace(/javascript:/gi, "");
        const sanitizedMatch = match.replace(/javascript:/gi, "");
        return `<a className="rounded-full px-1 py-0.5 glass-dark text-sky-400 hover:text-teal-400 transition-colors" href="//${sanitizedUrl}" target="_blank" rel="noopener noreferrer">${sanitizedMatch}</a>`;
      }
    );

  const email =
    channelDetails?.items[0]?.snippet?.localized?.description.match(
      mailRegex
    ) || "No Email Found";

  const rawViews = new Intl.NumberFormat("en-US").format(
    +channelDetails?.items[0]?.statistics?.viewCount
  );
  const rawVideoCount = new Intl.NumberFormat("en-US").format(
    +channelDetails?.items[0]?.statistics?.videoCount
  );

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
                  <>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        descRef?.current?.showModal();
                      }}
                      className="flex justify-start mt-4 cursor-pointer text-zinc-400"
                    >
                      <span className="max-w-[50%] line-clamp-1">
                        {channelDetails?.items[0]?.snippet?.description}
                      </span>
                      <strong className="font-bold text-white">more</strong>
                    </span>
                    <dialog
                      className="w-1/3 py-2 px-4 overflow-hidden font-semibold flex flex-col gap-2 min-h-1/2 rounded-2xl heroGradient backdrop:backdrop-blur-[1px] backdrop:bg-zinc-800/20 text-zinc-100 open: "
                      ref={descRef}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          descRef?.current?.close();
                        }}
                        className="absolute p-2 rounded-full cursor-pointer top-2 right-2 hover:backdrop-blur-sm hover:bg-zinc-50/20 active:bg-zinc-50/20"
                      >
                        <PiPlusBold className="w-5 h-5 rotate-45 text-zinc-50" />
                      </div>

                      <h2 className="text-2xl font-bold">Description</h2>

                      <div className="p-2 bg-zinc-100/10 rounded-2xl backdrop-blur-sm">
                        {parse(findingLinks || "No Description Found")}
                      </div>
                      <h2 className="text-2xl font-bold">More Info</h2>
                      <div className="grid gap-2 grid-cols-[24px,1fr] grid-auto-rows p-2 bg-zinc-100/5 rounded-2xl backdrop-blur-sm">
                        <div className="grid col-start-1 col-end-2 row-start-1 row-end-2 place-items-center">
                          <PiMailboxFill
                            size={20}
                            className="text-yellow-500"
                          />
                        </div>
                        <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                          {
                            <a
                              className="p-1 text-teal-400 transition-colors rounded-full hover:text-sky-400 hover:bg-slate-800 focus:text-sky-400 focus:bg-slate-800"
                              href={`mailto://${email[0]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {email[0]}
                            </a>
                          }
                        </div>
                        <div className="grid col-start-1 col-end-2 row-start-2 row-end-3 place-items-center">
                          <PiGlobeFill size={20} className="text-yellow-500" />
                        </div>
                        <div className="col-start-2 col-end-3 row-start-2 row-end-3">
                          <a
                            className="p-1 text-teal-400 transition-colors rounded-full hover:text-sky-400 hover:bg-slate-800 focus:text-sky-400 focus:bg-slate-800"
                            href={`//www.youtube.com/${channelDetails?.items[0]?.snippet.customUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`www.youtube.com/${channelDetails?.items[0]?.snippet.customUrl}`}
                          </a>
                        </div>
                        <div className="grid col-start-1 col-end-2 row-start-3 row-end-4 place-items-center">
                          <PiInfoFill size={20} className="text-yellow-500" />
                        </div>
                        <div className="col-start-2 col-end-3 row-start-3 row-end-4 p-1">
                          Joined{" "}
                          {formatDate(
                            channelDetails?.items[0]?.snippet?.publishedAt
                          ) || "Channel Release Date Not Found"}
                        </div>
                        <div className="grid col-start-1 col-end-2 row-start-4 row-end-5 place-items-center">
                          <PiUserListFill
                            size={20}
                            className="text-yellow-500"
                          />
                        </div>
                        <div className="col-start-2 col-end-3 row-start-4 row-end-5 p-1">
                          {rawViewsToString(
                            channelDetails?.items[0]?.statistics
                              ?.subscriberCount || "No Subscribers Found"
                          )}{" "}
                          subscribers
                        </div>
                        <div className="grid col-start-1 col-end-2 row-start-5 row-end-6 place-items-center">
                          <PiVideoFill size={20} className="text-yellow-500" />
                        </div>
                        <div className="col-start-2 col-end-3 row-start-5 row-end-6 p-1">
                          {rawVideoCount || "No Videos Found"} videos
                        </div>
                        <div className="grid col-start-1 col-end-2 row-start-6 row-end-7 place-items-center">
                          <PiArrowBendRightUpFill
                            size={20}
                            className="text-yellow-500"
                          />
                        </div>
                        <div className="col-start-2 col-end-3 row-start-6 row-end-7 p-1">
                          {rawViews || "View Status Not Found"} views
                        </div>
                      </div>
                    </dialog>
                  </>
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
