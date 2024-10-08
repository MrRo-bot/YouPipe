import { MdOutlineSearch } from "react-icons/md";
import HistoryCard from "../components/HistoryCard";

const History = () => {
  return (
    <div className="relative mb-2 mt-3 max-h-[90vh] rounded-xl mx-auto w-2/3 overflow-y-auto hideScrollbar">
      <h1 className="text-4xl font-bold">Watch history</h1>
      <div className="mt-10 mb-5 text-xl font-semibold max-w-max">Today</div>
      <div className="relative flex justify-between w-full">
        <div className="flex flex-col w-2/3 gap-4 my-2 ">
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
        </div>
        <div className="fixed right-28">
          <div className="flex items-center overflow-hidden transition">
            <div className="grid w-12 h-12 transition bg-opacity-0 cursor-pointer hover:text-white focus:text-white place-items-center ">
              <MdOutlineSearch className="w-full h-full p-1" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search watch history"
              className="relative w-full h-full px-4 py-2 font-semibold bg-transparent peer focus-visible:outline-none"
            />
            <div className="absolute self-end w-full h-0.5 bg-zinc-400 transition"></div>
            <div className="absolute self-end h-[3px] left-1/2 -translate-x-1/2 transition-all origin-center bg-transparent w-0 bg-white peer-focus-within:w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
