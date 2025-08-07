import { MouseEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import { RiArrowDownWideFill, RiArrowUpWideFill } from "react-icons/ri";

import { useAppDispatch, useAppSelector } from "../app/store";
import {
  addSubscription,
  clearSubscription,
} from "../features/subscriptionSlice";

import customToastFunction from "../utils/Toastify";

import { usePersistedState } from "../hooks/usePersistentStorage";

import SubscriptionList from "../components/subscription/SubscriptionList";

import { TokensType } from "../types/types";

const Subscription = () => {
  const [sortBy, setSortBy] = useState("relevance");
  const [expand, setExpand] = useState(false);
  const [fetchMore, setFetchMore] = useState(true);

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const dispatch = useAppDispatch();
  const subData = useAppSelector((state) => state.subscription);
  const isOpen = useAppSelector((state) => state.hamburger);

  const parts = ["contentDetails", "id", "snippet"];

  const { data, isLoading } = useQuery({
    queryKey: ["subscription", sortBy, fetchMore],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/subscriptions?mine=true&part=${parts.join(
            ","
          )}&order=${sortBy}&maxResults=50${
            fetchMore && subData?.nextPageToken
              ? `&pageToken=${subData?.nextPageToken}`
              : ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (!res.ok && res.status >= 400)
          throw new Error(`Error ${res.status} in fetching subscribers`);
        const subscription = await res.json();
        dispatch(addSubscription(subscription));
        setFetchMore(false);
        return subscription;
      } catch (error) {
        customToastFunction(
          `❌ ${error instanceof Error ? error.message : error}`,
          "error"
        );
      }
    },
    enabled: (!!sortBy && !!fetchMore) || !!token?.access_token,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const handleSort = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(clearSubscription());
    setSortBy(e.currentTarget.dataset.sort || "");
    setFetchMore(true);
    setExpand(false);
  };

  console.log(token?.access_token, subData?.pageInfo, data?.pageInfo);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={` hideScrollbar overflow-y-auto rounded-xl mb-2 mt-3 max-h-[90vh] ${
        !isOpen ? "w-[85vw]" : "w-full"
      }`}
    >
      <div className="relative min-h-full mx-auto 2xl:w-1/2 xl:w-2/3 lg:w-3/4 hideScrollbar rounded-xl">
        <div className="flex flex-col items-start gap-1 px-2 py-3 sm:gap-2 md:gap-5">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
            className="m-1 text-2xl font-bold tracking-tight md:m-2 md:text-3xl xl:text-4xl xl:m-4 text-slate-200"
          >
            All Subscriptions
          </motion.h1>

          {token?.access_token && (
            <div className="block mt-4 rounded-lg cursor-pointer md:mx-4">
              <div
                onClick={() => setExpand(!expand)}
                className="p-1 md:p-2.5 rounded-lg select-none flex items-center gap-2 max-w-max transition-colors bg-zinc-800 hover:bg-zinc-600 focus:bg-zinc-600 active:bg-zinc-600/70"
              >
                {sortBy === "relevance"
                  ? "Most relevant"
                  : sortBy === "unread"
                  ? "New activity"
                  : sortBy === "alphabetical"
                  ? "A-Z"
                  : ""}
                {expand ? (
                  <RiArrowUpWideFill className="transition-all size-2 md:size-4" />
                ) : (
                  <RiArrowDownWideFill className="transition-all size-2 md:size-4" />
                )}
              </div>
              <div
                className={`${
                  expand ? "absolute" : "hidden"
                } z-50 mt-2 overflow-hidden rounded-lg max-w-max transition-all`}
              >
                <div
                  data-sort="relevance"
                  onClick={(e) => handleSort(e)}
                  className="p-1 md:p-2.5 transition-colors bg-zinc-800 hover:bg-black focus:bg-black active:bg-black"
                >
                  Most relevant
                </div>
                <div
                  data-sort="unread"
                  onClick={(e) => handleSort(e)}
                  className="p-1 md:p-2.5 transition-colors bg-zinc-800 hover:bg-black focus:bg-black active:bg-black"
                >
                  New activity
                </div>
                <div
                  data-sort="alphabetical"
                  onClick={(e) => handleSort(e)}
                  className="p-1 md:p-2.5 transition-colors bg-zinc-800 hover:bg-black focus:bg-black active:bg-black"
                >
                  A-Z
                </div>
              </div>
            </div>
          )}
        </div>

        {!token?.access_token ? (
          <div className="col-start-1 px-6 py-3 mx-auto text-center transition-colors lg:px-10 xl:px-14 2xl:px-20 -col-end-1 w-max glass hover:bg-indigo-600/20 focus:bg-indigo-600/20">
            <i className="block text-xs md:text-sm xl:text-base">
              Login to fetch your subscribers list
            </i>
          </div>
        ) : data && data?.pageInfo?.totalResults === 0 ? (
          <div className="mx-auto text-2xl italic font-bold w-max">
            Not Found
          </div>
        ) : isLoading ? (
          <FidgetSpinner
            visible={true}
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper size-16 md:size-20 mx-auto translate-y-1/2 -top-1/2"
          />
        ) : (
          <Virtuoso
            className="!flex !flex-col !overflow-y-auto !min-h-[85vh] lg:!min-h-[75vh] !hideScrollbar"
            increaseViewportBy={100}
            data={subData.items}
            totalCount={subData.pageInfo.totalResults}
            itemContent={(_, data) => (
              <SubscriptionList key={data.id} sub={data} />
            )}
            endReached={() =>
              setTimeout(
                () =>
                  subData.items.length < subData?.pageInfo?.totalResults &&
                  setFetchMore(true),
                1000
              )
            }
            context={subData}
            components={{
              Footer: ({ context: subData }) => {
                return subData &&
                  subData.items.length < subData.pageInfo.totalResults ? (
                  <ThreeDots
                    visible={true}
                    height="50"
                    width="50"
                    color="#3bf6fcbf"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="justify-center"
                  />
                ) : (
                  <div className="mx-auto text-lg italic font-bold w-max">
                    -----------------End of the list-----------------
                  </div>
                );
              },
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Subscription;
