/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { SearchType, TokensType } from "../types/types";
import VideoCard from "./VideoCard";
import { usePersistedState } from "../hooks/usePersistentStorage";

const VideoList = ({ video }: { video: SearchType }) => {
  //data for individual components
  const [videoStat, setVideoStat] = useState();
  const [channelStat, setChannelStat] = useState();

  //channel parts to be called with the API
  const channelParts = ["statistics", "snippet"];

  //video parts to be called with the API
  const videoParts = ["statistics", "snippet", "contentDetails"];

  const [tokenData] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //query for getting video and channel data for video card
  useEffect(() => {
    (async () => {
      const resVideo = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${
          video?.id?.videoId
        }&part=${videoParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${tokenData?.access_token}`,
          },
        }
      );
      const resChannel = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${
          video?.snippet?.channelId
        }&part=${channelParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${tokenData?.access_token}`,
          },
        }
      );
      const videoStat = await resVideo.json();
      const channelStat = await resChannel.json();

      setVideoStat(videoStat);
      setChannelStat(channelStat);
    })();
  }, []);

  return (
    <div className="p-2">
      <VideoCard video={videoStat!} channel={channelStat!} />
    </div>
  );
};

export default VideoList;
