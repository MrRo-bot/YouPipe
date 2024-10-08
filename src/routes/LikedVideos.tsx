import {
  MdOutlineDownload,
  MdOutlinePlayArrow,
  MdOutlineShuffle,
} from "react-icons/md";
import { useExtractColor } from "react-extract-colors";
import LikedVideosCard from "../components/LikedVideosCard";

const LikedVideos = () => {
  const { lighterColor } = useExtractColor(
    "https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=480"
  );

  return (
    <div className="mb-2 mt-3 max-h-[90vh] rounded-2xl mx-4 w-full flex">
      <div
        style={{
          background: `linear-gradient(to bottom, ${lighterColor?.replace(
            ")",
            ",0.3)"
          )} 33%, rgba(15,15,15,0.100) 100%)`,
        }}
        className="flex flex-col w-3/12 h-[87vh] rounded-2xl my-1 px-6"
      >
        <div className="my-6 overflow-hidden rounded-2xl aspect-video">
          <img
            src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=480"
            alt=""
          />
        </div>
        <h1 className="text-2xl font-bold">Liked videos</h1>
        <h3 className="mt-5 text-sm font-semibold tracking-tighter">
          Chhavimani Choubey
        </h3>
        <div className="flex gap-2 mt-2 text-sm font-medium tracking-tighter text-zinc-400">
          <span>162 videos</span>
          <span>No views</span>
          <span>Updated today</span>
        </div>

        <div className="grid w-10 h-10 p-2 mt-4 transition rounded-full cursor-pointer place-items-center hover:bg-zinc-400/25 focus:bg-zinc-400/25 bg-zinc-200/25">
          <MdOutlineDownload className="w-full h-full" />
        </div>

        <div className="flex gap-2 mt-4 justify-evenly">
          <div className="flex items-center justify-center w-full gap-1 p-2 text-sm font-semibold text-black transition rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-zinc-200/75 focus:bg-zinc-200/75">
            <MdOutlinePlayArrow className="w-6 h-6" />
            Play all
          </div>
          <div className="flex items-center justify-center w-full gap-1 p-2 text-sm font-semibold transition rounded-full cursor-pointer place-items-center bg-zinc-200/25 focus:bg-zinc-400/25 hover:bg-zinc-400/25">
            <MdOutlineShuffle className="w-6 h-6" />
            Shuffle
          </div>
        </div>
      </div>
      <div className="w-9/12 max-h-[90vh] overflow-y-auto hideScrollbar flex flex-col gap-4 rounded-2xl mx-2 my-1">
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 my-2 text-sm text-black transition bg-white rounded-lg cursor-pointer max-w-max">
            All
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 my-2 text-sm transition bg-gray-800 rounded-lg cursor-pointer hover:bg-zinc-500/50 focus:bg-zinc-500/50 max-w-max">
            Videos
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 my-2 text-sm transition bg-gray-800 rounded-lg cursor-pointer hover:bg-zinc-500/50 focus:bg-zinc-500/50 max-w-max">
            Shorts
          </div>
        </div>
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
        <LikedVideosCard count={1} />
      </div>
    </div>
  );
};

export default LikedVideos;
