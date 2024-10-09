import { MdOutlineSearch } from "react-icons/md";
import ChannelOverviewCard from "../components/ChannelOverviewCard";

const ChannelOverview = () => {
  return (
    <div className="relative mx-4 mb-2 mt-3 max-h-[90vh] overflow-y-auto hideScrollbar w-full">
      <div className="w-9/12 mx-auto">
        <div className="h-[20vh] overflow-hidden rounded-2xl">
          <img
            className="object-cover w-full"
            src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=1280"
            alt=""
          />
        </div>

        <div className="flex items-center justify-start gap-4 pt-4">
          <div className="grid w-40 overflow-hidden rounded-full place-items-center">
            <img
              className="w-full h-full"
              src="https://yt3.googleusercontent.com/ytc/AIdro_mXtRw_Eu5K5RGuxoXmnuOalGb0jRcKOcYBhsAD7hVJ0BI=s160-c-k-c0x00ffffff-no-rj"
              alt=""
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold">Chhavimani Choubey</h1>
            <span className="text-sm text-zinc-400">
              @chhavimanichoubey9437 • 20 subscribers • 22 videos
            </span>
            <span className="text-sm text-zinc-400">
              Control is illusion...
              <strong className="font-bold text-white">more</strong>
            </span>
            <div className="flex justify-start gap-2">
              <div className="px-4 py-2 text-sm font-semibold text-center align-middle transition bg-gray-700 rounded-full cursor-pointer focus:bg-gray-600 hover:bg-gray-600">
                Customise Channel
              </div>
              <div className="px-4 py-2 text-sm font-semibold text-center align-middle transition bg-gray-700 rounded-full cursor-pointer focus:bg-gray-600 hover:bg-gray-600">
                Manage Videos
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full shadow-[0_1px_0_0_gray]">
        <div className="flex items-center w-9/12 gap-5 mx-auto">
          <div className="py-4 px-0.5 font-bold shadow-[0_2px_0_0_white] cursor-pointer">
            Home
          </div>
          <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
            Videos
          </div>
          <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
            Playlists
          </div>
          <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
            Community
          </div>
          <div className="relative py-2 px-0.5 flex gap-2 cursor-pointer">
            <MdOutlineSearch className="w-6 h-6 peer" />
          </div>
        </div>
      </div>
      <div className="w-9/12 mx-auto">
        <div className="shadow-[0_1px_0_0_gray]">
          <div>
            <h2 className="pt-4 text-xl font-bold tracking-wide">For You</h2>
          </div>
          <div className="flex gap-1 px-1 py-8 overflow-x-scroll hideScrollbar">
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
            <ChannelOverviewCard size={"big"} />
          </div>
        </div>
        <div className="shadow-[0_1px_0_0_gray]">
          <div>
            <h2 className="pt-4 text-xl font-bold tracking-wide">Videos</h2>
          </div>
          <div className="flex gap-1 px-1 py-8 overflow-x-scroll hideScrollbar">
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
            <ChannelOverviewCard size={"small"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelOverview;
