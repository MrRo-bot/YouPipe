import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { extractColors } from "extract-colors";

import { MdOutlinePlaylistPlay } from "react-icons/md";

import { elapsedTime } from "../../utils/functions";
import { PlaylistType } from "../../types/types";

const PlaylistCard = ({ playlist }: { playlist: PlaylistType }) => {
  const [extractedColors, setExtractedColors] = useState([
    {
      hex: "",
      red: 0,
      green: 0,
      blue: 0,
      area: 1,
      hue: 0,
      saturation: 1,
      lightness: 1,
      intensity: 1,
    },
  ]);

  const navigate = useNavigate();

  const date = new Date(playlist?.snippet?.publishedAt || "").getTime();

  useEffect(() => {
    if (playlist?.snippet?.thumbnails?.high?.url) {
      extractColors(playlist?.snippet?.thumbnails?.high?.url, {
        crossOrigin: "anonymous",
      }).then((data) => {
        setExtractedColors(data);
      });
    }
  }, [playlist?.snippet?.thumbnails?.high?.url]);

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <motion.div
        variants={{
          hidden: { scale: 0.95 },
          visible: { scale: 1 },
        }}
        initial={"hidden"}
        whileInView={"visible"}
        className="z-0 p-1 mx-auto transition-colors cursor-pointer rounded-xl group max-w-96 hover:bg-indigo-600/20 focus:bg-indigo-600/20 active:bg-zinc-600/70"
      >
        <div className="flex flex-col gap-2">
          <div
            style={
              {
                "--bg": `rgb(${extractedColors[0].red},${extractedColors[0].green},${extractedColors[0].blue})`,
              } as React.CSSProperties
            }
            className={
              playlist?.snippet?.thumbnails?.maxres?.url
                ? `
          before:content-['']
          before:absolute
          before:inline-block
          before:w-[95%]
          before:-translate-x-1/2
          before:left-1/2
          before:h-10
          before:-z-10
          before:-top-[1px]
          before:rounded-xl
          before:bg-[var(--bg)]
          before:opacity-40
          before:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.4)]
          
          after:content-['']
          after:absolute
          after:inline-block
          after:w-[93%]
          after:-translate-x-1/2
          after:left-1/2
          after:h-10
          after:-z-20
          after:-top-[5px]
          after:rounded-xl
          after:bg-[var(--bg)]
          after:opacity-25
          after:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.4)]
          `
                : ""
            }
          >
            <div className="relative overflow-hidden aspect-video rounded-xl before:absolute shadow-[0px_0px_0px_1px_rgba(255,255,255,0.4)]">
              {playlist ? (
                <>
                  <img
                    referrerPolicy="no-referrer"
                    className="w-full h-full transition-transform group-hover:scale-110 group-focus:scale-110"
                    src={playlist?.snippet?.thumbnails?.maxres?.url}
                    alt=""
                  />
                  <div className="absolute px-1 py-0.5 md:p-1 gap-0.5 text-xs text-white rounded-xl bottom-1 right-1 glass-dark flex items-center">
                    <MdOutlinePlaylistPlay className="size-3 md:size-4" />{" "}
                    {playlist?.contentDetails?.itemCount} videos
                  </div>
                </>
              ) : (
                <Skeleton
                  width={"100%"}
                  height={"100%"}
                  className="!rounded-2xl -top-1"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 px-2">
            <div className="flex justify-between">
              {playlist ? (
                <div className="text-lg font-bold md:font-extrabold text-ellipsis line-clamp-1 text-zinc-50">
                  {playlist?.snippet?.title}
                </div>
              ) : (
                <Skeleton width={200} height={15} className="rounded-2xl" />
              )}
            </div>

            {playlist.status ? (
              <div className="flex items-center gap-1 text-xs tracking-wide text-zinc-300">
                {playlist.status.privacyStatus.slice(0, 1).toUpperCase() +
                  playlist.status.privacyStatus.slice(1)}{" "}
                • Playlist
              </div>
            ) : (
              <Skeleton width={100} className="rounded-2xl" />
            )}
            {playlist ? (
              <div className="text-xs tracking-wide text-zinc-300">
                {elapsedTime(date)} ago
              </div>
            ) : (
              <Skeleton
                width={150}
                height={10}
                className="rounded-2xl -top-1"
              />
            )}
            {playlist ? (
              <div
                onClick={() => navigate(`/playlist/${playlist?.id}`)}
                className="text-sm font-medium tracking-wide transition-colors text-zinc-400 hover:text-zinc-50 focus:text-zinc-50"
              >
                View full playlist
              </div>
            ) : (
              <Skeleton
                width={120}
                height={10}
                className="rounded-2xl -top-3"
              />
            )}
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default PlaylistCard;
