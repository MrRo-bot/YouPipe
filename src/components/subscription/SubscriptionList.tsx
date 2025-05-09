import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppSelector } from "../../app/store";
import SubscriptionCard from "./SubscriptionCard";
import { ChannelInfoType, SubscriptionType } from "../../types/types";

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
        if (!res.ok) throw new Error("Oh no! didn't get subscribers data");
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
          theme: "light",
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
