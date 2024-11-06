import { useEffect, useState } from "react";
import { useAppSelector } from "../app/store";
import SubscriptionCard from "./SubscriptionCard";
import { SubscriptionType } from "../types/types";

const SubscriptionList = ({ sub }: { sub: SubscriptionType }) => {
  const [channelStats, setChannelStats] = useState();
  const tokenData = useAppSelector((state) => state.token);

  const parts = ["statistics", "snippet"];

  const id = sub?.snippet?.resourceId?.channelId;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/channels?id=${id}&part=${parts.join(
            ","
          )}&key=${import.meta.env.VITE_API_KEY}`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${tokenData?.access_token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Oh no!");
        const channel = await res.json();
        if (channel) setChannelStats(channel);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return <SubscriptionCard stat={channelStats!} />;
};

export default SubscriptionList;
