import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "../app/store";

import InfiniteLoader from "../components/InfiniteLoader";
import { addSubscription } from "../features/subscriptionSlice";
import SubscriptionList from "../hooks/SubscriptionList";

const Subscription = () => {
  const [sortBy, setSortBy] = useState("relevance");

  const tokenData = useAppSelector((state) => state.token);
  const subData = useAppSelector((state) => state.subscription);

  const dispatch = useAppDispatch();

  const part = ["contentDetails", "id", "snippet"];
  const sort = [
    { value: "relevance", option: "Most relevant" },
    { value: "unread", option: "New activity" },
    { value: "alphabetical", option: "A-Z" },
  ];

  useQuery({
    queryKey: ["subscription", sortBy],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?mine=true&part=${part.join(
          ","
        )}&order=${sortBy}&maxResults=50`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${tokenData?.access_token}`,
          },
        }
      );
      const subscription = await res.json();
      dispatch(addSubscription(subscription));
      return subscription;
    },
    enabled: !!sortBy,
  });

  return (
    <AnimatePresence>
      <div className="w-full hideScrollbar overflow-y-auto rounded-xl mb-2 mt-3 max-h-[90vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          className="relative w-1/2 mx-auto hideScrollbar rounded-xl"
        >
          <div className="flex flex-col items-start justify-between px-2 py-3">
            <h1 className="text-4xl font-bold tracking-tight text-center text-slate-200">
              All Subscriptions
            </h1>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
          </div>
          <div className="flex flex-col gap-3 p-2">
            {subData.items.map((sub) => (
              <SubscriptionList key={sub.id} data={sub} />
            ))}
            <InfiniteLoader />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Subscription;
