import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";

import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import { SubscriptionListType, TokensType } from "../types/types";
import { useAppDispatch, useAppSelector } from "../app/store";
import {
  addSubscription,
  clearSubscription,
} from "../features/subscriptionSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import SubscriptionList from "../components/SubscriptionList";

//footer shows loading or end of list
const Footer = ({ context: subData }: { context: SubscriptionListType }) => {
  return subData?.items?.length < subData?.pageInfo?.totalResults ? (
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
    <div className="mx-auto text-lg italic font-bold w-max">End</div>
  );
};

const Subscription = () => {
  //sorting options
  const [sortBy, setSortBy] = useState("relevance");

  //fetch more data when scrolling down
  const [fetchMore, setFetchMore] = useState(true);

  //custom hook for getting token data from localStorage
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //dispatching reducers
  const dispatch = useAppDispatch();

  //getting access to redux store
  const subData = useAppSelector((state) => state.subscription);
  const isOpen = useAppSelector((state) => state.hamburger);

  //parts used for API calls
  const parts = ["contentDetails", "id", "snippet"];

  //list of sorting options
  const sort = [
    { value: "relevance", option: "Most relevant" },
    { value: "unread", option: "New activity" },
    { value: "alphabetical", option: "A-Z" },
  ];

  //query for getting subscription list and storing in redux (triggered by fetchMore state as well)
  useQuery({
    queryKey: ["subscription", sortBy, fetchMore],
    queryFn: async () => {
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
      const subscription = await res.json();
      dispatch(addSubscription(subscription));
      setFetchMore(false);

      return subscription;
    },
    enabled: !!sortBy && !!fetchMore,
    refetchOnWindowFocus: false,
  });

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
          <div className="flex flex-col items-start justify-between px-2 py-3">
            <h1 className="text-4xl font-bold tracking-tight text-center text-slate-200">
              All Subscriptions
            </h1>

            <select
              defaultValue={sortBy}
              onChange={(e) => {
                dispatch(clearSubscription());
                setFetchMore(true);
                setSortBy(e.target.value);
              }}
              className="p-3 mt-5 font-bold transition-all rounded-md cursor-pointer bg-zinc-800"
            >
              {sort.map((s) => (
                <option
                  key={s.value}
                  className="text-sm font-medium transition-all font-text"
                  value={s.value}
                >
                  {s.option}
                </option>
              ))}
            </select>

            {/* Virtuoso component for rendering list of subscriptions */}
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
              endReached={() => setTimeout(() => setFetchMore(true), 500)}
              context={subData}
              components={{ Footer }}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Subscription;
