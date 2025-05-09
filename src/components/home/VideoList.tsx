import { usePersistedState } from "../../hooks/usePersistentStorage";
import VideoCard from "./VideoCard";
import { SearchType, TokensType } from "../../types/types";
import { useQuery } from "@tanstack/react-query";

const VideoList = ({ video }: { video: SearchType }) => {
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

  const { data: videoStat, isSuccess: videoSuccess } = useQuery({
    queryKey: ["videoStat"],
    queryFn: async () => {
      const resVideo = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${
          video?.id?.videoId
        }&part=${videoParts.join(",")}&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      return await resVideo.json();
    },
  });

  const { data: channelStat, isSuccess: channelSuccess } = useQuery({
    queryKey: ["videoStat"],
    queryFn: async () => {
      const resChannel = await fetch(
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
      return await resChannel.json();
    },
  });

  return (
    <div className="p-2">
      <VideoCard
        video={videoStat}
        videoSuccess={videoSuccess}
        channel={channelStat}
        channelSuccess={channelSuccess}
      />
    </div>
  );
};

export default VideoList;
