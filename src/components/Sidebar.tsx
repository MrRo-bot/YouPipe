import {
  AiOutlineBulb,
  AiOutlineDown,
  AiOutlineHistory,
  AiOutlineHome,
  AiOutlineLike,
  AiOutlineProfile,
  AiOutlineSetting,
  AiOutlineShopping,
  AiOutlineTrophy,
} from "react-icons/ai";

import {
  MdOutlineFeaturedPlayList,
  MdOutlineMovie,
  MdOutlinePodcasts,
  MdOutlineUnsubscribe,
  MdOutlineWatchLater,
} from "react-icons/md";

import { LiaVideoSolid } from "react-icons/lia";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { IoMusicalNoteOutline, IoNewspaperOutline } from "react-icons/io5";
import { TbHanger } from "react-icons/tb";
import { CiStreamOn } from "react-icons/ci";
import { SiYoutubegaming } from "react-icons/si";

const Sidebar = () => {
  return (
    <aside className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-center gap-6 p-3">
          <AiOutlineHome className="w-6 h-6" />
          <div>Home</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <MdOutlineUnsubscribe className="w-6 h-6" />
          <div>Subscriptions</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineProfile className="w-6 h-6" />
          <div>Your channel</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineHistory className="w-6 h-6" />
          <div>History</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <MdOutlineFeaturedPlayList className="w-6 h-6" />
          <div>Playlist</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <LiaVideoSolid className="w-6 h-6" />
          <div>Your videos</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <MdOutlineWatchLater className="w-6 h-6" />
          <div>Watch later</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineLike className="w-6 h-6" />
          <div>Liked videos</div>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="px-2 py-4 text-xl font-extrabold font-kode text-slate-950">
          Subscriptions
        </h2>
        <div className="flex items-center gap-6 p-3">
          <div className="grid w-6 h-6 overflow-hidden rounded-full place-items-center">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div>sub 1</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <div className="grid w-6 h-6 overflow-hidden rounded-full place-items-center">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div>sub 2</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <div className="grid w-6 h-6 overflow-hidden rounded-full place-items-center">
            <img className="p-1" src="icon.svg" alt="profile" />
          </div>
          <div>sub 3</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineDown className="w-5 h-5" />
          <div>Show mode</div>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="px-2 py-4 text-xl font-extrabold font-kode text-slate-950">
          Explore
        </h2>
        <div className="flex items-center gap-6 p-3">
          <HiOutlineArrowTrendingUp className="w-6 h-6" />
          <div>Trending</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineShopping className="w-6 h-6" />
          <div>Shopping</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <IoMusicalNoteOutline className="w-6 h-6" />
          <div>Music</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <MdOutlineMovie className="w-6 h-6" />
          <div>Movies</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <CiStreamOn className="w-6 h-6" />
          <div>Live</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <SiYoutubegaming className="w-6 h-6" />
          <div>Gaming</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <IoNewspaperOutline className="w-6 h-6" />
          <div>News</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineTrophy className="w-6 h-6" />
          <div>Sports</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <AiOutlineBulb className="w-6 h-6" />
          <div>Courses</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <TbHanger className="w-6 h-6" />
          <div>Fashion & beauty</div>
        </div>
        <div className="flex items-center gap-6 p-3">
          <MdOutlinePodcasts className="w-6 h-6" />
          <div>Podcasts</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-6 p-3">
          <AiOutlineSetting className="w-6 h-6" />
          <div>Settings</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
