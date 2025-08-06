import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import {
  PiListStarFill,
  PiHouseFill,
  PiMonitorPlayFill,
  PiThumbsUpFill,
} from "react-icons/pi";

import { useAppSelector } from "../../app/store";

const Sidebar = () => {
  const isOpen = useAppSelector((state) => state.hamburger.isOpen);

  return window.innerWidth < 1024 ? (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed z-50 flex gap-2 p-1 transition-colors -translate-x-1/2 bottom-4 glass active:bg-indigo-600/20 left-1/2"
    >
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
        <div className="px-2 py-1 transition-colors cursor-pointer rounded-xl active:text-zinc-900 active:bg-zinc-400">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.2 }}
            className="w-full"
          >
            <PiHouseFill className="size-5 md:size-7 lg:size-9" />
          </motion.div>
        </div>
      </NavLink>
      <NavLink
        to="subscriptions"
        className={({ isActive, isPending }) =>
          isPending
            ? ""
            : isActive
            ? "bg-white rounded-xl text-black font-bold"
            : ""
        }
      >
        <div className="px-2 py-1 transition-colors cursor-pointer rounded-xl active:text-zinc-900 active:bg-zinc-400">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
            className="w-full"
          >
            <PiMonitorPlayFill className="size-5 md:size-7 lg:size-9" />
          </motion.div>
        </div>
      </NavLink>
      <NavLink
        to="playlists"
        className={({ isActive, isPending }) =>
          isPending
            ? ""
            : isActive
            ? "bg-white rounded-xl text-black font-bold"
            : ""
        }
      >
        <div className="px-2 py-1 transition-colors cursor-pointer rounded-xl active:text-zinc-900 active:bg-zinc-400">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.4 }}
            className="w-full"
          >
            <PiListStarFill className="size-5 md:size-7 lg:size-9" />
          </motion.div>
        </div>
      </NavLink>
      <NavLink
        to="likedvideos"
        className={({ isActive, isPending }) =>
          isPending
            ? ""
            : isActive
            ? "bg-white rounded-xl text-black font-bold"
            : ""
        }
      >
        <div className="px-2 py-1 transition-colors cursor-pointer rounded-xl active:text-zinc-900 active:bg-zinc-400">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.5 }}
            className="w-full"
          >
            <PiThumbsUpFill className="size-5 md:size-7 lg:size-9" />
          </motion.div>
        </div>
      </NavLink>
    </motion.aside>
  ) : (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`flex flex-col mt-3 mb-2 h-max hover:bg-indigo-600/20 focus:bg-indigo-600/20 transition-colors ${
        !isOpen ? "!w-[4.5rem] h-max gap-1 px-1 py-2" : "w-[15vw] 2xl:pr-3"
      } overflow-y-scroll hideScrollbar glass`}
    >
      {!isOpen || window.innerWidth < 1536 ? (
        <>
          {/* Shrinked sidebar section =================================================================================================*/}
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
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-xl transition-colors tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiHouseFill className="size-4" />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                Home
              </motion.div>
            </div>
          </NavLink>
          <NavLink
            to="subscriptions"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-xl text-black font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-xl transition-colors tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiMonitorPlayFill className="size-4" />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                Subs
              </motion.div>
            </div>
          </NavLink>
          <NavLink
            to="playlists"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-xl text-black font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-xl transition-colors tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiListStarFill className="size-4" />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                PLists
              </motion.div>
            </div>
          </NavLink>
          <NavLink
            to="likedvideos"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-white rounded-xl text-black font-bold"
                : ""
            }
          >
            <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-xl transition-colors tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiThumbsUpFill className="size-4" />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                Liked
              </motion.div>
            </div>
          </NavLink>
        </>
      ) : (
        <>
          {/* Expaned siderbar section =================================================================================================*/}
          <div className="flex flex-col gap-1 py-3 pl-3 pr-0">
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-xl transition-colors tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiHouseFill className="size-7" />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  Home
                </motion.div>
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-xl transition-colors tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiMonitorPlayFill className="size-7" />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  Subscriptions
                </motion.div>
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-xl transition-colors tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiListStarFill className="size-7" />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  Playlists
                </motion.div>
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
              <div className="flex items-center gap-5 hover:bg-zinc-400 focus:bg-zinc-400 px-2.5 py-1.5 rounded-xl transition-colors tracking-tight  hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiThumbsUpFill className="size-7" />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  Liked Videos
                </motion.div>
              </div>
            </NavLink>
          </div>
        </>
      )}
    </motion.aside>
  );
};

export default Sidebar;
