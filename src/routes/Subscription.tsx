import { MdOutlineGridView, MdOutlineViewList } from "react-icons/md";
import VideoCard from "../components/VideoCard";

const Subscription = () => {
  return (
    <div className="relative ml-4 mb-2 mt-3 max-h-[90vh] overflow-y-auto hideScrollbar rounded-xl">
      <div className="flex items-center justify-between px-1 py-3">
        <h1 className="text-xl font-bold text-center font-heading text-slate-200">
          Latest
        </h1>
        <div className="flex items-center justify-between gap-3">
          <div className="px-5 py-1 text-blue-300 rounded-full cursor-pointer font-text place-items-center hover:font-bold focus:font-bold hover:bg-blue-100 focus:bg-blue-100 hover:text-black focus:text-black">
            <span>Manage</span>
          </div>
          <div className="grid w-12 h-12 transition rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
            <MdOutlineGridView className="w-6 h-6" />
          </div>

          <div className="grid w-12 h-12 transition rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
            <MdOutlineViewList className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="grid grid-flow-row gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
      </div>
    </div>
  );
};

export default Subscription;
