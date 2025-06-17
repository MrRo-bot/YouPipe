import { usePersistedState } from "../../hooks/usePersistentStorage";
import VideoCard from "./VideoCard";
import { SearchType, TokensType } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";

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
      try {
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
        if (!resVideo.ok) throw new Error("Error in fetching video stats");
        return await resVideo.json();
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

  const { data: channelStat, isSuccess: channelSuccess } = useQuery({
    queryKey: ["videoStat"],
    queryFn: async () => {
      try {
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
        if (!resChannel.ok)
          throw new Error("Error in fetching channel video stats");
        return await resChannel.json();
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
