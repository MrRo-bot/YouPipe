import { MdOutlineGridView, MdOutlineViewList } from "react-icons/md";
import VideoCard from "../components/VideoCard";

const Subscription = () => {
  return (
    <div className="mt-[7vh]">
      <div className="flex items-center justify-between px-3 py-4">
        <h1 className="text-xl font-extrabold text-center font-kode text-slate-950">
          Latest
        </h1>
        <div className="flex items-center justify-between gap-3">
          <div className="px-5 py-1 text-blue-600 transition-all rounded-full cursor-pointer font-sometype place-items-center hover:bg-blue-600/15 focus:bg-blue-600/15">
            <span className="">Manage</span>
          </div>
          <div className="grid p-2 transition-all rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200">
            <MdOutlineGridView className="w-6 h-6" />
          </div>
          <div className="grid p-2 transition-all rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200">
            <MdOutlineViewList className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="grid grid-flow-row mx-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
