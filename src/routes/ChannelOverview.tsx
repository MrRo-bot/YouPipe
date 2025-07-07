import { useRef, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  PiArrowBendRightUpFill,
  PiGlobeFill,
  PiInfoFill,
  PiMailboxFill,
  PiPlusBold,
  PiUserListFill,
  PiVideoFill,
} from "react-icons/pi";

import { useAppDispatch, useAppSelector } from "../app/store";

import {
  addChannelDetails,
  addChannelSections,
} from "../features/channelOverviewSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

import { formatDate, rawViewsToString } from "../utils/functions";

import { TokensType } from "../types/types";

const ChannelOverview = () => {
  const descRef = useRef<HTMLDialogElement>(null);

  const [sub, setSub] = useState(false);

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
    refetchOnMount: true,
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

  useQuery({
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

  const { isLoading, data: isSubData } = useQuery({
    queryKey: ["channelOverviewSubCheck", channelDetails?.items[0]?.id],
    queryFn: async () => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${
          channelDetails?.items[0]?.id
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
    enabled: !!channelDetails?.items[0]?.id,
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
                kind: channelDetails?.items[0]?.kind,
                channelId: channelDetails?.items[0]?.id,
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
    channelDetails?.items[0]?.snippet?.localized?.description.match(mailRegex);

  const rawViews = new Intl.NumberFormat("en-US").format(
    +channelDetails?.items[0]?.statistics?.viewCount
  );
  const rawVideoCount = new Intl.NumberFormat("en-US").format(
    +channelDetails?.items[0]?.statistics?.videoCount
  );

  const handleDelSub = () => {
    if (window.confirm("Are you sure you want to unsubscribe 😿?")) {
      if (isSubData?.pageInfo?.totalResults) {
        subDelMutation.mutate(isSubData?.items[0]?.id);
        setSub(false);
      }
    }
  };

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`relative mx-4 mb-2 mt-3 max-h-[90vh] overflow-y-auto hideScrollbar ${
          !isOpen ? "w-[85vw]" : "w-full"
        } `}
      >
        <div className="mx-auto lg:w-9/12">
          {channelDetails?.items[0]?.brandingSettings?.image
            ?.bannerExternalUrl ? (
            isLoading ? (
              <div className="h-[10vh] md:h-[14vh] lg:h-[18vh] overflow-hidden rounded-2xl">
                <Skeleton className="object-cover w-full h-full pt-1" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut", delay: 0.5 }}
                className="h-[10vh] md:h-[14vh] lg:h-[18vh] overflow-hidden rounded-2xl"
              >
                <img
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                  src={
                    channelDetails?.items[0]?.brandingSettings?.image
                      ?.bannerExternalUrl
                  }
                  alt=""
                />
              </motion.div>
            )
          ) : (
            <div>No Banner Image Found</div>
          )}
          <div className="flex items-center justify-start gap-4 py-4">
            <div className="relative overflow-hidden rounded-full min-w-28 min-h-28 lg:min-w-32 lg:min-h-32 xl:min-w-36 xl:min-h-36 2xl:min-w-40 2xl:min-h-40">
              {isLoading ? (
                <Skeleton
                  className="absolute inset-0 w-full h-full"
                  circle={true}
                  height="100%"
                  containerClassName="absolute inset-0"
                />
              ) : (
                <img
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 object-cover w-full h-full rounded-full"
                  src={
                    channelDetails?.items[0]?.snippet?.thumbnails?.default?.url
                  }
                  alt=""
                />
              )}
            </div>

            <div className="flex flex-col min-w-64">
              {isLoading ? (
                <Skeleton className="!w-[70%] mb-2 min-h-4" />
              ) : (
                <h1 className="text-xl font-extrabold md:text-2xl xl:text-3xl text-zinc-50">
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
                <span className="flex items-center gap-1 text-xs md:text-base text-zinc-50">
                  <strong>
                    {channelDetails?.items[0]?.snippet?.customUrl}
                  </strong>
                  •
                  <span className="text-zinc-200">
                    {channelDetails?.items[0]?.statistics &&
                      rawViewsToString(
                        channelDetails?.items[0]?.statistics?.subscriberCount
                      )}{" "}
                    subscribers •
                  </span>
                  <span className="text-zinc-200">
                    {channelDetails?.items[0]?.statistics &&
                      rawViewsToString(
                        channelDetails?.items[0]?.statistics?.videoCount
                      )}{" "}
                    videos
                  </span>
                </span>
              )}
              {isLoading ? (
                <Skeleton className="my-2 !min-w-48 md:w-3/4 xl:w-1/2" />
              ) : (
                <>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      descRef?.current?.showModal();
                    }}
                    className="flex justify-start cursor-pointer text-zinc-400"
                  >
                    <span className="w-1/2 my-2 text-sm md:w-3/4 xl:w-1/2 md:text-base line-clamp-1">
                      {channelDetails?.items[0]?.snippet?.description}
                    </span>
                    <strong className="my-2 text-sm font-bold text-white md:text-base">
                      more
                    </strong>
                  </span>
                  <dialog
                    className="w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-6/12 py-2 px-4 overflow-hidden font-semibold flex flex-col gap-2 rounded-2xl heroGradient backdrop:backdrop-blur-[1px] backdrop:bg-zinc-800/20 text-zinc-100"
                    ref={descRef}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        descRef?.current?.close();
                      }}
                      className="absolute p-2 rounded-full cursor-pointer top-2 right-2 hover:backdrop-blur-sm hover:bg-zinc-50/20 active:bg-zinc-50/20"
                    >
                      <PiPlusBold className="rotate-45 size-5 text-zinc-50" />
                    </div>

                    <h2 className="text-xl font-bold md:text-2xl text-zinc-50">
                      Description
                    </h2>

                    <div className="text-sm md:text-base p-2 bg-zinc-100/10 rounded-2xl text-violet-200 backdrop-blur-3xl shadow-[0_0_0_1px_rgb(255,255,255,0.15)]">
                      {parse(findingLinks || "No Description Found")}
                    </div>

                    <h2 className="text-xl font-bold md:text-2xl text-zinc-50">
                      More Info
                    </h2>

                    <div className="text-sm md:text-base grid gap-2 grid-cols-[24px,1fr] grid-auto-rows text-indigo-200 p-2 bg-zinc-100/5 rounded-2xl backdrop-blur-3xl shadow-[0_0_0_1px_rgb(255,255,255,0.15)]">
                      <div className="grid col-start-1 col-end-2 row-start-1 row-end-2 place-items-center">
                        <PiMailboxFill size={20} className="text-yellow-500" />
                      </div>
                      <div className="col-start-2 col-end-3 row-start-1 row-end-2 p-1">
                        {email ? (
                          <a
                            className="text-teal-400 transition-colors rounded-full hover:text-sky-400 hover:bg-slate-800 focus:text-sky-400 focus:bg-slate-800"
                            href={`mailto://${email[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {email[0]}
                          </a>
                        ) : (
                          "No Email Found"
                        )}
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
                        <PiUserListFill size={20} className="text-yellow-500" />
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
              {isLoading ? (
                <Skeleton className="px-3 py-2 !rounded-full !w-24" />
              ) : (
                <div
                  className={`grid place-items-center overflow-hidden px-1 py-0.5 md:py-1 md:px-2 xl:px-3 xl:py-1.5 w-max font-medium transition-colors rounded-full cursor-pointer select-none ${
                    sub
                      ? "bg-zinc-800 hover:bg-zinc-600/70 focus:bg-zinc-600/70 active:bg-zinc-600/70 "
                      : "bg-white text-black hover:bg-zinc-200/70 focus:bg-zinc-200/70 active:bg-zinc-200/70"
                  } `}
                >
                  <AnimatePresence>
                    {sub ? (
                      <span onClick={handleDelSub}>Subscribed</span>
                    ) : (
                      <span
                        onClick={() => {
                          setSub(true);
                          subAddMutation.mutate();
                        }}
                      >
                        Subscribe
                      </span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full mb-2 shadow-[0_1px_0_0_rgba(150,150,150,0.5)]">
          <div className="flex items-center w-full gap-3 pt-3 pb-2 mx-auto lg:w-9/12">
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? "text-black bg-white rounded-md" : ""
              }
              end
            >
              <div className="text-sm md:text-base flex flex-col items-center gap-1 px-1 py-0.5 md:px-2 md:py-1 text-center transition-colors ease-in-out rounded-md cursor-pointer hover:bg-zinc-400 focus:bg-zinc-400 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
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
              <div className="text-sm md:text-base flex flex-col items-center gap-1 px-1 py-0.5 md:px-2 md:py-1 text-center transition-colors ease-in-out rounded-md cursor-pointer hover:bg-zinc-400 focus:bg-zinc-400 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
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
              <div className="text-sm md:text-base flex flex-col items-center gap-1 px-1 py-0.5 md:px-2 md:py-1 text-center transition-colors ease-in-out rounded-md cursor-pointer hover:bg-zinc-400 focus:bg-zinc-400 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
                Playlists
              </div>
            </NavLink>
          </div>
        </div>

        <div className="w-full mx-auto lg:w-9/12">
          <Outlet />
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default ChannelOverview;
