import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FidgetSpinner } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";
import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "../../app/store";

import SubscriptionCard from "../subscription/SubscriptionCard";

import { ChannelInfoType } from "../../types/types";

const ChannelsList = ({ id }: { id: string }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  const token = useAppSelector((state) => state.token);
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
  });

  return (
    <div className="p-2">
      <SubscriptionCard stat={channelStats!} subId={id} />
    </div>
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
    <AnimatePresence>
      <div className="hideScrollbar overflow-y-auto rounded-xl mb-2 mt-3 max-h-[90vh] w-full">
        {!channelsList ? (
          <div className="mx-auto text-lg italic font-bold w-max">
            No Channels Found
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="relative w-3/4 min-h-full mx-auto hideScrollbar rounded-xl"
          >
            {channelsList.length < 1 ? (
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
                itemContent={(_, data) => <ChannelsList key={data} id={data} />}
              />
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Channels;
