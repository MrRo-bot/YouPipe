import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";

import {
  PiListStarFill,
  PiHouseFill,
  PiMonitorPlayFill,
  PiThumbsUpFill,
} from "react-icons/pi";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addCategories } from "../features/categoriesSlice";

const Sidebar = () => {
  //for toggling side menu to expand or collapse
  const isOpen = useAppSelector((state) => state.hamburger.isOpen);

  //location codes
  const regionCode = useAppSelector((state) => state.location);
  //categories
  const categories = useAppSelector((state) => state.categories);

  //dispatch reducers for store
  const dispatch = useAppDispatch();

  //query for getting youtube categories based on region
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=${regionCode.address.country_code.toUpperCase()}&key=${
          import.meta.env.VITE_API_KEY
        }`
      );
      const data = await res.json();
      dispatch(addCategories(data));
      //react toastify for fetch error
      toast(
        `${
          data?.items?.length > 1
            ? "✅ categories fetched"
            : "❌ categories not fetched"
        }`,
        {
          position: "bottom-left",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <aside
      className={`flex flex-col mt-3 mb-2 ${
        !isOpen ? "!w-[4.5rem] h-max gap-1 px-1 py-2" : "h-[90vh] w-[15vw] pr-3"
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
            {/* <PiUserSwitchFill className="w-4 h-4" /> */}
            {/* <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiUserSwitchFill className="w-4 h-4" />
              <div className="w-full">You</div>
            </div> */}
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
            {/* <div className="flex flex-col items-center gap-1 hover:bg-zinc-400 focus:bg-zinc-400 py-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-400">
              <PiUserSwitchFill className="w-4 h-4" />
              <div className="w-full">You</div>
            </div> */}
          </NavLink>
        </>
      ) : (
        <>
          {/* Expaned siderbar section =================================================================================================*/}
          <div className="flex flex-col py-3 gap-1 pl-3 pr-0 border-zinc-400 border-solid border-b-[1px]">
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
              <div className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
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
              <div className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiMonitorPlayFill className="w-7 h-7" />
                <div className="w-full">Subscriptions</div>
              </div>
            </NavLink>
            {/* <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? ""
                  : isActive
                  ? "bg-white rounded-xl text-black font-bold"
                  : ""
              }
              to="channeloverview"
            >
              <div className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiUserSwitchFill className="w-7 h-7" />
                <div className="w-full">Your channel</div>
              </div>
            </NavLink> */}

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
              <div className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
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
              <div className="flex items-center gap-6 hover:bg-zinc-400 focus:bg-zinc-400 px-[1.3em] py-1.5 rounded-xl transition tracking-tight text-sm hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-200">
                <PiThumbsUpFill className="w-7 h-7" />
                <div className="w-full">Liked Videos</div>
              </div>
            </NavLink>
          </div>

          {/* Explore section */}
          <div className="flex flex-col gap-1 py-3 pr-0 pl-3 border-zinc-400 border-solid border-b-[1px]">
            <h2 className="px-3 py-2 text-xl font-bold tracking-wide text-slate-100">
              Explore
            </h2>
            {categories?.items?.length > 1 ? (
              categories?.items?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-6 px-[1.3em] py-1.5 bg-zinc-100 bg-opacity-0 rounded-xl transition tracking-tight text-sm hover:bg-opacity-100 hover:text-black focus:text-black focus:bg-opacity-100 cursor-pointer active:text-zinc-900 active:bg-zinc-400"
                >
                  <div className="w-full">{category?.snippet?.title}</div>
                </div>
              ))
            ) : (
              <ThreeDots
                visible={true}
                height="50"
                width="50"
                color="#3bf6fcbf"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass="justify-center"
              />
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
