import { MdKeyboardArrowDown } from "react-icons/md";
import ChannelCard from "../components/ChannelCard";

const Channels = () => {
  return (
    <div className="w-full overflow-y-auto hideScrollbar">
      <div className="relative mb-2 mt-3 w-[60%] max-h-[90vh] rounded-xl mx-auto">
        <h1 className="pt-2 text-4xl font-bold">All Subscriptions</h1>
        <div className="flex items-center gap-2 px-2 py-1 my-2 rounded-md cursor-pointer bg-zinc-800 max-w-max">
          A-Z <MdKeyboardArrowDown className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-4 my-7">
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
          <ChannelCard />
        </div>
      </div>
    </div>
  );
};

export default Channels;
