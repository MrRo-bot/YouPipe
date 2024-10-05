import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-2 py-2 glass">
      <div className="flex items-center justify-between gap-6">
        <div className="grid w-12 h-12 transition-all rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
          <RxHamburgerMenu className="w-full h-full p-3" />
        </div>
        <Link className="flex items-center min-h-10" to="/">
          <div>
            <img
              className="w-8 h-8 text-nowrap indent-[100%] overflow-hidden"
              src="icon.svg"
              alt="youpipe"
            />
          </div>
          <div className="ml-1.5 text-2xl font-black font-heading tracking-wide">
            YouPipe
          </div>
          <div className="self-start text-xs text-slate-400">IN</div>
        </Link>
      </div>
      <div className="flex w-1/3 overflow-hidden transition-all rounded-full glass-dark hover:outline focus:outline outline-1 outline-zinc-600">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="w-full h-full px-3 py-2 bg-transparent"
        />
        <div className="grid w-20 transition-all border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
          <MdOutlineSearch className="w-7 h-7" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 min-h-12">
          <div className="grid transition-all rounded-full cursor-pointer w-11 h-11 place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
            <AiOutlineVideoCameraAdd className="w-full h-full p-3" />
          </div>
          <div className="grid transition-all rounded-full cursor-pointer w-11 h-11 place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
            <FaRegBell className="w-full h-full p-3" />
          </div>

          <div className="transition-all grid w-12 h-12  rounded-full cursor-pointer place-items-center outline outline-[1px] outline-zinc-600">
            <img className="p-2" src="icon.svg" alt="profile" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
