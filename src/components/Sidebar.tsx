import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PiListStarFill,
  PiClockFill,
  PiHouseFill,
  PiLightbulbFill,
  PiTelevisionFill,
  PiFilmSlateFill,
  PiMusicNotesFill,
  PiNewspaperFill,
  PiGooglePodcastsLogoFill,
  PiGearSixFill,
  PiShoppingBagFill,
  PiTrophyFill,
  PiGameControllerFill,
  PiMonitorPlayFill,
  PiUserSwitchFill,
  PiThumbsUpFill,
  PiTrendUpFill,
  PiShoppingCartFill,
} from "react-icons/pi";
import { MdKeyboardArrowDown, MdVideoSettings } from "react-icons/md";

type SidebarType = {
  icon: JSX.Element;
  text: string;
};

const Sidebar = () => {
  const isOpen = useSelector(
    (state: { hamburger: { isOpen: boolean } }) => state.hamburger.isOpen
  );

  const EXPLORE: SidebarType[] = [
    { icon: <PiTrendUpFill className="w-7 h-7" />, text: "Trending" },
    { icon: <PiShoppingBagFill className="w-7 h-7" />, text: "Shopping" },
    { icon: <PiMusicNotesFill className="w-7 h-7" />, text: "Music" },
    { icon: <PiFilmSlateFill className="w-7 h-7" />, text: "Movies" },
    { icon: <PiTelevisionFill className="w-7 h-7" />, text: "Live" },
    { icon: <PiGameControllerFill className="w-7 h-7" />, text: "Gaming" },
    { icon: <PiNewspaperFill className="w-7 h-7" />, text: "News" },
    { icon: <PiTrophyFill className="w-7 h-7" />, text: "Sports" },
    { icon: <PiLightbulbFill className="w-7 h-7" />, text: "Courses" },
    {
      icon: <PiShoppingCartFill className="w-7 h-7" />,
      text: "Fashion & beauty",
    },
    {
      icon: <PiGooglePodcastsLogoFill className="w-7 h-7" />,
      text: "Podcasts",
    },
  ];

  return (
    <aside
      className={`flex flex-col mt-3 mb-2 max-h-[90vh] ${
        !isOpen ? "min-w-[3.5rem] gap-1" : "min-w-[11vw] pr-3"
      } overflow-y-scroll hideScrollbar glass`}
    >
      {!isOpen ? (
        <ul>
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
            <li className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer">
              <PiHouseFill className="w-4 h-4" />
              <div className="w-full">Home</div>
            </li>
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
            <li className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer">
              <PiMonitorPlayFill className="w-4 h-4" />
              <div className="w-full">Subs</div>
            </li>
          </NavLink>
          <NavLink
            to="channeloverview"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-md text-black font-bold"
                : ""
            }
          >
            <li className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer">
              <PiUserSwitchFill className="w-4 h-4" />
              <div className="w-full">You</div>
            </li>
          </NavLink>
          <NavLink
            to="watchlater"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-md text-black font-bold"
                : ""
            }
          >
            <li className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer">
              <PiClockFill className="w-4 h-4" />
              <div className="w-full">Watch</div>
            </li>
          </NavLink>
        </ul>
      ) : (
        <>
          <ul className="flex flex-col py-3 pl-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiHouseFill className="w-7 h-7" />
                <div className="w-full">Home</div>
              </li>
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiMonitorPlayFill className="w-7 h-7" />
                <div className="w-full">Subscriptions</div>
              </li>
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiUserSwitchFill className="w-7 h-7" />
                <div className="w-full">Your channel</div>
              </li>
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiClockFill className="w-7 h-7" />
                <div className="w-full">History</div>
              </li>
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiListStarFill className="w-7 h-7" />
                <div className="w-full">Playlist</div>
              </li>
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "" : isActive ? "" : ""
              }
              to=""
            >
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <MdVideoSettings className="w-7 h-7" />
                <div className="w-full">Your videos</div>
              </li>
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiClockFill className="w-7 h-7" />
                <div className="w-full">Watch later</div>
              </li>
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
              <li className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer">
                <PiThumbsUpFill className="w-7 h-7" />
                <div className="w-full">Liked videos</div>
              </li>
            </NavLink>
          </ul>

          <ul className="flex flex-col py-3 pr-0 pl-3 border-zinc-400 border-solid border-b-[1px]">
            <h2 className="px-3 py-2 text-xl font-bold tracking-wide text-slate-100">
              Subscriptions
            </h2>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <div className="transition grid w-7 h-7 rounded-full aspect-square cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
                <img className="p-1" src="icon.svg" alt="profile" />
              </div>
              <div className="w-full">sub 1</div>
            </li>

            <div className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <MdKeyboardArrowDown className="w-7 h-7" />
              <div className="w-full">Show more</div>
            </div>
          </ul>

          <ul className="flex flex-col py-3 pr-0 pl-3 border-zinc-400 border-solid border-b-[1px]">
            <h2 className="px-3 py-2 text-xl font-bold tracking-wide text-slate-100">
              Explore
            </h2>
            {EXPLORE.map(({ icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer"
              >
                {icon}
                <div className="w-full">{text}</div>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col py-3 pl-3 pr-0">
            <li className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer">
              <PiGearSixFill className="w-7 h-7" />
              <div className="w-full">Settings</div>
            </li>
          </ul>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
