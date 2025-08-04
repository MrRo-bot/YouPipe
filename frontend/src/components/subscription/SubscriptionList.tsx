import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "../../app/store";
import SubscriptionCard from "./SubscriptionCard";
import { ChannelInfoType, SubscriptionType } from "../../types/types";

const SubscriptionList = ({ sub }: { sub: SubscriptionType }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  const token = useAppSelector((state) => state.token);

  const id = sub?.snippet?.resourceId;

  const parts = ["statistics", "snippet"];

  useQuery({
    queryKey: ["subChannelStats", id],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${
          id?.channelId
        }&part=${parts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
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
    <div className="py-1 md:p-2">
      {<SubscriptionCard stat={channelStats!} subId={sub.id} subRes={id!} />}
    </div>
  );
};

export default SubscriptionList;
