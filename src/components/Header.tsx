import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { PiX } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { addProfile } from "../features/profileSlice";
import { DecodedJwtType, ProfileType } from "../types/types";
import { toggle } from "../features/hamburgerMenuSlice";
import { jwtDecode } from "jwt-decode";
import { unixToTimeString } from "../utils/math";

const Header = () => {
  const [clearSearch, setClearSearch] = useState(false);

  const dispatch = useDispatch();

  const fetchedProfile = useSelector(
    (state: { profile: ProfileType }) => state.profile
  );

  const getProfileData = (creds: DecodedJwtType) => {
    dispatch(
      addProfile({
        issuer: creds.iss,
        clientId: creds.aud,
        uniqueId: creds.sub,
        email: creds.email,
        emailVerified: creds.email_verified,
        name: creds.name,
        picture: creds.picture,
        givenName: creds.given_name,
        familyName: creds.family_name,
        creationTime: unixToTimeString(creds.iat),
        expiryTime: unixToTimeString(creds.exp),
      })
    );
  };

  const localData =
    fetchedProfile.picture && JSON.parse(localStorage.getItem("profile") || "");

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
          <div className="grid w-10 h-10 transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black">
            <AiOutlineVideoCameraAdd className="w-full h-full p-2.5" />
          </div>
          <div className="grid w-10 h-10 overflow-hidden rounded-full cursor-pointer place-items-center">
            {localData.picture ? (
              <img src={localData.picture} alt={localData.name[0]} />
            ) : (
              <GoogleLogin
                onSuccess={(creds) => {
                  getProfileData(jwtDecode(creds.credential || ""));
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                auto_select
                theme="filled_blue"
                type="icon"
                shape="circle"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
