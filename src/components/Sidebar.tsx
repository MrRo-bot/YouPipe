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
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="flex flex-col pr-3 mt-3 max-h-[90vh] min-w-[12vw] overflow-y-scroll hideScrollbar glass">
      <div className="flex flex-col pt-3 pl-3 pb-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineHome className="w-7 h-7" />
            <div className="w-full">Home</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
          to="subscriptions"
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineSubscriptions className="w-7 h-7" />
            <div className="w-full">Subscriptions</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
          to="channeloverview"
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineSwitchAccount className="w-7 h-7" />
            <div className="w-full">Your channel</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
          to="history"
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineHistory className="w-7 h-7" />
            <div className="w-full">History</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
          to="playlists"
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineFeaturedPlayList className="w-7 h-7" />
            <div className="w-full">Playlist</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending ? "" : isActive ? "" : ""
          }
          to=""
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineVideoSettings className="w-7 h-7" />
            <div className="w-full">Your videos</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
          to="watchlater"
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineWatchLater className="w-7 h-7" />
            <div className="w-full">Watch later</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? ""
              : isActive
              ? "bg-white rounded-xl text-black font-bold"
              : ""
          }
          to="likedvideos"
        >
          <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
            <MdOutlineThumbUp className="w-7 h-7" />
            <div className="w-full">Liked videos</div>
          </div>
        </NavLink>
      </div>

      <div className="flex flex-col pt-3 pl-3 pb-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
        <h2 className="px-3 py-2 text-xl font-bold tracking-wide text-slate-100">
          Subscriptions
        </h2>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div className="w-full">sub 1</div>
        </div>

        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdKeyboardArrowDown className="w-7 h-7" />
          <div className="w-full">Show more</div>
        </div>
      </div>

      <div className="flex flex-col pt-3 pl-3 pb-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
        <h2 className="px-3 py-2 text-xl font-bold tracking-wide text-slate-100">
          Explore
        </h2>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineTrendingUp className="w-7 h-7" />
          <div className="w-full">Trending</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineShoppingBag className="w-7 h-7" />
          <div className="w-full">Shopping</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineMusicNote className="w-7 h-7" />
          <div className="w-full">Music</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineMovie className="w-7 h-7" />
          <div className="w-full">Movies</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineLiveTv className="w-7 h-7" />
          <div className="w-full">Live</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineSportsEsports className="w-7 h-7" />
          <div className="w-full">Gaming</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineNewspaper className="w-7 h-7" />
          <div className="w-full">News</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineSports className="w-7 h-7" />
          <div className="w-full">Sports</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineLightbulb className="w-7 h-7" />
          <div className="w-full">Courses</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <TbHanger className="w-7 h-7" />
          <div className="w-full">Fashion & beauty</div>
        </div>
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlinePodcasts className="w-7 h-7" />
          <div className="w-full">Podcasts</div>
        </div>
      </div>
      <div className="flex flex-col pt-3 pb-3 pl-3 pr-0">
        <div className="flex items-center gap-6 px-3 py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight font-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
          <MdOutlineSettings className="w-7 h-7" />
          <div className="w-full">Settings</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
