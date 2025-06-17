import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "../../app/store";
import SubscriptionCard from "./SubscriptionCard";
import { ChannelInfoType, SubscriptionType } from "../../types/types";
import { Bounce, toast } from "react-toastify";

const SubscriptionList = ({ sub }: { sub: SubscriptionType }) => {
  const [channelStats, setChannelStats] = useState<ChannelInfoType>();
  const token = useAppSelector((state) => state.token);

  const id = sub?.snippet?.resourceId?.channelId;

  const parts = ["statistics", "snippet"];

  useQuery({
    queryKey: ["channelStats", id],
    queryFn: async () => {
      try {
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
        if (!res.ok) throw new Error("Error in fetching channel stats");
        const channel = await res.json();
        setChannelStats(channel);
        return channel;
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
  });

  return (
    <div className="p-2">
      <SubscriptionCard stat={channelStats!} subId={sub?.id} />
    </div>
  );
};

export default SubscriptionList;
