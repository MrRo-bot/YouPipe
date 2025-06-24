import { NavLink } from "react-router-dom";

import {
  PiListStarFill,
  PiHouseFill,
  PiMonitorPlayFill,
  PiThumbsUpFill,
} from "react-icons/pi";

import { useAppSelector } from "../../app/store";

const Sidebar = () => {
  const isOpen = useAppSelector((state) => state.hamburger.isOpen);

  return (
    <aside
      className={`flex flex-col mt-3 mb-2 h-max ${
        !isOpen ? "!w-[4.5rem] h-max gap-1 px-1 py-2" : "w-[15vw] pr-3"
      } overflow-y-scroll hideScrollbar glass`}
    >
      {!isOpen ? (
        <>
          {/* Shrinked sidebar section =================================================================================================*/}
          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "rounded-md text-black bg-white font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiHouseFill className="w-4 h-4" />
              <div className="w-full">Home</div>
            </div>
          </NavLink>
          <NavLink
            to="subscriptions"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-md text-black font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiMonitorPlayFill className="w-4 h-4" />
              <div className="w-full">Subs</div>
            </div>
          </NavLink>
          <NavLink
            to="playlists"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-md text-black font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiListStarFill className="w-4 h-4" />
              <div className="w-full">PLists</div>
            </div>
          </NavLink>
          <NavLink
            to="likedvideos"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-md text-black font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiThumbsUpFill className="w-4 h-4" />
              <div className="w-full">Liked</div>
            </div>
          </NavLink>
        </>
      ) : (
        <>
          {/* Expaned siderbar section =================================================================================================*/}
          <div className="flex flex-col gap-1 py-3 pl-3 pr-0 ">
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-2xl transition tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiHouseFill className="w-7 h-7" />
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-2xl transition tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiMonitorPlayFill className="w-7 h-7" />
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
              to="playlists"
            >
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-2xl transition tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiListStarFill className="w-7 h-7" />
                <div className="w-full">Playlists</div>
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-2xl transition tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiThumbsUpFill className="w-7 h-7" />
                <div className="w-full">Liked Videos</div>
              </div>
            </NavLink>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
