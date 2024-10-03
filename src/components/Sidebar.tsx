import {
  MdKeyboardArrowDown,
  MdOutlineFeaturedPlayList,
  MdOutlineHistory,
  MdOutlineHome,
  MdOutlineLightbulb,
  MdOutlineLiveTv,
  MdOutlineMovie,
  MdOutlineMusicNote,
  MdOutlineNewspaper,
  MdOutlinePodcasts,
  MdOutlineSettings,
  MdOutlineShoppingBag,
  MdOutlineSports,
  MdOutlineSportsEsports,
  MdOutlineSubscriptions,
  MdOutlineSwitchAccount,
  MdOutlineThumbUp,
  MdOutlineTrendingUp,
  MdOutlineVideoSettings,
  MdOutlineWatchLater,
} from "react-icons/md";

import { TbHanger } from "react-icons/tb";

const Sidebar = () => {
  return (
    <aside className="flex flex-col pr-2 ">
      <div className="flex flex-col pt-3 pl-2 pb-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineHome className="w-7 h-7" />
          <div className="w-full font-medium">Home</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineSubscriptions className="w-7 h-7" />
          <div className="w-full font-medium">Subscriptions</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineSwitchAccount className="w-7 h-7" />
          <div className="w-full font-medium">Your channel</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineHistory className="w-7 h-7" />
          <div className="w-full font-medium">History</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineFeaturedPlayList className="w-7 h-7" />
          <div className="w-full font-medium">Playlist</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineVideoSettings className="w-7 h-7" />
          <div className="w-full font-medium">Your videos</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineWatchLater className="w-7 h-7" />
          <div className="w-full font-medium">Watch later</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineThumbUp className="w-7 h-7" />
          <div className="w-full font-medium">Liked videos</div>
        </div>
      </div>

      <div className="flex flex-col pt-3 pl-2 pb-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
        <h2 className="px-3 py-2 text-xl font-extrabold font-kode text-slate-950">
          Subscriptions
        </h2>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <div className="grid overflow-hidden rounded-full w-7 h-7 place-items-center">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full font-medium">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <div className="grid overflow-hidden rounded-full w-7 h-7 place-items-center">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full font-medium">sub 2</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <div className="grid overflow-hidden rounded-full w-7 h-7 place-items-center">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full font-medium">sub 3</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdKeyboardArrowDown className="w-7 h-7" />
          <div className="w-full font-medium">Show mode</div>
        </div>
      </div>

      <div className="flex flex-col pt-3 pl-2 pb-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
        <h2 className="px-3 py-2 text-xl font-extrabold font-kode text-slate-950">
          Explore
        </h2>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineTrendingUp className="w-7 h-7" />
          <div className="w-full font-medium">Trending</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineShoppingBag className="w-7 h-7" />
          <div className="w-full font-medium">Shopping</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineMusicNote className="w-7 h-7" />
          <div className="w-full font-medium">Music</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineMovie className="w-7 h-7" />
          <div className="w-full font-medium">Movies</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineLiveTv className="w-7 h-7" />
          <div className="w-full font-medium">Live</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineSportsEsports className="w-7 h-7" />
          <div className="w-full font-medium">Gaming</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineNewspaper className="w-7 h-7" />
          <div className="w-full font-medium">News</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineSports className="w-7 h-7" />
          <div className="w-full font-medium">Sports</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineLightbulb className="w-7 h-7" />
          <div className="w-full font-medium">Courses</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <TbHanger className="w-7 h-7" />
          <div className="w-full font-medium">Fashion & beauty</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlinePodcasts className="w-7 h-7" />
          <div className="w-full font-medium">Podcasts</div>
        </div>
      </div>
      <div className="flex flex-col pt-3 pb-3 pl-2 pr-0">
        <div className="flex items-center gap-6 px-3 py-1.5 rounded-xl">
          <MdOutlineSettings className="w-7 h-7" />
          <div className="w-full font-medium">Settings</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
