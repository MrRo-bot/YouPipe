import { MouseEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RiArrowDownWideFill, RiArrowUpWideFill } from "react-icons/ri";

import { useAppDispatch, useAppSelector } from "../app/store";
import {
  addSubscription,
  clearSubscription,
} from "../features/subscriptionSlice";
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

  useQuery({
    queryKey: ["subscription", sortBy, fetchMore],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/subscriptions?mine=true&part=${parts.join(
            ","
          )}&order=${sortBy}&maxResults=50&pageToken=${
            fetchMore ? subData?.nextPageToken : ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error in fetching subscribers");
        const subscription = await res.json();
        dispatch(addSubscription(subscription));
        setFetchMore(false);
        return subscription;
      } catch (error) {
        toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
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
    },
    enabled: !!sortBy && !!fetchMore,
  });

  const handleSort = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(clearSubscription());
    setSortBy(e.currentTarget.dataset.sort || "");
    setFetchMore(true);
    setExpand(false);
  };

  return (
    <AnimatePresence>
      <div
        className={` hideScrollbar overflow-y-auto rounded-xl mb-2 mt-3 max-h-[90vh] ${
          !isOpen ? "w-[85vw]" : "w-full"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          className="relative w-1/2 min-h-full mx-auto hideScrollbar rounded-xl"
        >
          <div className="flex flex-col items-start gap-5 px-2 py-3">
            <h1 className="mx-4 text-4xl font-bold tracking-tight text-center text-slate-200">
              All Subscriptions
            </h1>

            <div className="block mx-4 mt-4 rounded-lg cursor-pointer">
              <div
                onClick={() => setExpand(!expand)}
                className="p-2.5 rounded-lg select-none flex items-center gap-2 max-w-max transition-colors bg-zinc-800 hover:bg-zinc-600 focus:bg-zinc-600 active:bg-zinc-600/70"
              >
                {sortBy === "relevance"
                  ? "Most relevant"
                  : sortBy === "unread"
                  ? "New activity"
                  : sortBy === "alphabetical"
                  ? "A-Z"
                  : ""}
                {expand ? (
                  <RiArrowUpWideFill className="w-4 h-4 transition-all" />
                ) : (
                  <RiArrowDownWideFill className="w-4 h-4 transition-all" />
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
                  className="p-2.5 transition-colors bg-zinc-800 hover:bg-black focus:bg-black"
                >
                  Most relevant
                </div>
                <div
                  data-sort="unread"
                  onClick={(e) => handleSort(e)}
                  className="p-2.5 transition-colors bg-zinc-800 hover:bg-black focus:bg-black"
                >
                  New activity
                </div>
                <div
                  data-sort="alphabetical"
                  onClick={(e) => handleSort(e)}
                  className="p-2.5 transition-colors bg-zinc-800 hover:bg-black focus:bg-black"
                >
                  A-Z
                </div>
              </div>
            </div>
          </div>

          {subData?.items?.length <= 1 ? (
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
              data={subData?.items}
              totalCount={subData?.pageInfo?.totalResults}
              itemContent={(_, data) => (
                <SubscriptionList key={data?.id} sub={data} />
              )}
              endReached={() => setTimeout(() => setFetchMore(true), 1000)}
              context={subData}
              components={{
                Footer: ({ context: subData }) => {
                  return subData &&
                    subData?.items?.length < subData?.pageInfo?.totalResults ? (
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Subscription;
