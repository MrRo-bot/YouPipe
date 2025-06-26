import { useEffect, useState } from "react";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import VideoCard from "./VideoCard";

import {
  ChannelInfoType,
  TokensType,
  VideosListType,
  VideoType,
} from "../../types/types";

const VideoList = ({ video }: { video: VideoType }) => {
  const [videoStat, setVideoStat] = useState<VideosListType>();
  const [channelStat, setChannelStat] = useState<ChannelInfoType>();

  const channelParts = ["statistics", "snippet"];
  const videoParts = ["statistics", "snippet", "contentDetails"];

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${
          video?.id
        }&part=${videoParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const videoData = await res.json();
      setVideoStat(videoData);
      return videoData;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?id=${
          video?.snippet?.channelId
        }&part=${channelParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const channelData = await res.json();
      setChannelStat(channelData);
      return channelData;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.snippet?.channelId]);

  return (
    <div className="p-2">
      {videoStat && channelStat && (
        <VideoCard video={videoStat!} channel={channelStat!} />
      )}
    </div>
  );
};

export default VideoList;
