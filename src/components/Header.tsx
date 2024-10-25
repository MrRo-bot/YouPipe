import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";

import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { PiUserCirclePlusFill, PiX } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { useAppDispatch, useAppSelector } from "../app/store";
import { toggle } from "../features/hamburgerMenuSlice";
import { addProfile } from "../features/profileSlice";
import { addToken } from "../features/tokenSlice";

const Header = () => {
  const [clearSearch, setClearSearch] = useState(false);

  const profileData = useAppSelector((state) => state.profile);
  const tokenData = useAppSelector((state) => state.token);

  const dispatch = useAppDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const token = await fetch("https://localhost:8089/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ code }),
      });
      const data = await token.json();
      dispatch(addToken(data));
    },
    flow: "auth-code",
  });

  const { isPending } = useQuery({
    queryKey: ["profile", tokenData?.access_token],
    queryFn: async () => {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenData?.access_token}`
      );
      const data = await response.json();
      dispatch(addProfile(data));
      return data;
    },
    enabled: !!tokenData?.access_token,
  });

  if (!localStorage.getItem("profile")) {
    localStorage.setItem(
      "profile",
      JSON.stringify({ picture: profileData?.picture, name: profileData?.name })
    );
  }

  const localProfile = JSON.parse(localStorage.getItem("profile") || "");

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
      <div className="flex items-stretch w-1/3 overflow-hidden transition rounded-full glass-dark hover:outline focus:outline outline-1 outline-zinc-600">
        <input
          onChange={(e) => setClearSearch(e.target.value !== "" ? true : false)}
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="w-full h-full py-2 pl-4 pr-12 font-semibold bg-transparent"
        />

        <div
          onClick={() => (
            ((document.getElementById("search") as HTMLInputElement).value =
              ""),
            setClearSearch(false)
          )}
          className={`absolute ${
            !clearSearch ? "hidden" : "grid"
          } transition -translate-y-1/2 rounded-full cursor-pointer right-20 top-1/2 min-w-8 min-h-8 aspect-square place-items-center hover:bg-zinc-500/50 focus:bg-zinc-500/50`}
        >
          <PiX className="w-7 h-7" />
        </div>
        <div className="grid w-20 transition bg-opacity-0 border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black">
          <MdOutlineSearch className="w-6 h-6" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 mx-2 min-h-12">
          <div className="grid transition bg-opacity-0 rounded-full cursor-pointer w-9 h-9 place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black">
            <AiOutlineVideoCameraAdd className="w-full h-full p-2.5" />
          </div>
          <div
            onClick={googleLogin}
            className="grid w-10 h-10 overflow-hidden transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black"
          >
            {!localProfile.picture ? (
              <PiUserCirclePlusFill className="w-full h-full p-1" />
            ) : (
              <img src={localProfile?.picture} alt={localProfile?.name[0]} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
