/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useAppSelector } from "../../app/store";
import { SubscriptionType } from "../../types/types";
import SubscriptionCard from "./SubscriptionCard";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubscriptionList = ({ sub }: { sub: SubscriptionType }) => {
  //storing channel stats from subscription details
  const [channelStats, setChannelStats] = useState();

  //getting token data from redux store
  const tokenData = useAppSelector((state) => state.token);

  //parts to be called with the API
  const parts = ["statistics", "snippet"];

  const id = sub?.snippet?.resourceId?.channelId;

  //effect for using subscribers id and getting channel data from it to display in subscription section
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
        if (!res.ok) throw new Error("Oh no! didn't get subscribers data");
        const channel = await res.json();
        if (channel) setChannelStats(channel);
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
    })();
  }, []);

  return (
    <div className="p-2">
      <SubscriptionCard stat={channelStats!} subId={sub?.id} />
    </div>
  );
};

export default SubscriptionList;
