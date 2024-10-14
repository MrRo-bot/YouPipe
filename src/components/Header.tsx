import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggle } from "../features/hamburgerMenuSlice";

const Header = () => {
  const dispatch = useDispatch();
  return (
    <header className="flex items-center justify-between px-2 py-1 glass">
      <div className="flex items-center justify-between gap-6">
        <div
          onClick={() => dispatch(toggle())}
          className="grid w-10 h-10 transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black"
        >
          <RxHamburgerMenu className="w-full h-full p-2.5" />
        </div>
        <NavLink className="flex items-center min-h-10" to="/">
          <div className="w-8 h-8">
            <img
              className="text-nowrap indent-[100%] overflow-hidden"
              src="icon.svg"
              alt="youpipe"
            />
          </div>
          <div className="ml-1.5 text-2xl font-bold  tracking-tighter">
            YouPipe
          </div>
          <div className="self-start text-xs text-slate-400">IN</div>
        </NavLink>
      </div>
      <div className="flex w-1/3 overflow-hidden transition rounded-full glass-dark hover:outline focus:outline outline-1 outline-zinc-600">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="w-full h-full px-4 py-2 font-semibold bg-transparent"
        />
        <div className="grid w-20 transition bg-opacity-0 border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black">
          <MdOutlineSearch className="w-6 h-6" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 min-h-12">
          <div className="grid w-10 h-10 transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black">
            <AiOutlineVideoCameraAdd className="w-full h-full p-2.5" />
          </div>
          <div className="grid w-10 h-10 transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black">
            <FaRegBell className="w-full h-full p-2.5" />
          </div>

          <div className="transition grid w-10 h-10 rounded-full cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-2" src="icon.svg" alt="profile" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
