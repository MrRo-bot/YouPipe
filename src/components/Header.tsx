/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";

import { PiUserCirclePlusFill, PiX } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { useAppDispatch, useAppSelector } from "../app/store";
import { collapse, expand, toggle } from "../features/hamburgerMenuSlice";
import { addProfile } from "../features/profileSlice";
import { addToken } from "../features/tokenSlice";
import { addSearchString, clearSearchList } from "../features/searchSlice";
import { getLocationData } from "../features/locationSlice";
import { clearCommentsThread } from "../features/commentsThreadSlice";
import { clearHomeVideos } from "../features/homeSlice";
import { removeTimestamp } from "../features/timestampSlice";
import { clearPlayItems } from "../features/playlistOverviewSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { ProfileType, TokensType } from "../types/types";

const Header = () => {
  //clearing search field in various ways
  const [clearSearch, setClearSearch] = useState(false);

  //location hook for detecting route location
  const location = useLocation();

  //fetching tokens
  const [fetchTokens, setFetchTokens] = useState(false);

  //location coordinates from custom hook
  const locationCoords = useCurrentLocation();

  //navigate to any route
  const navigate = useNavigate();

  //custom hook for reading and storing in localStorage
  const [profile, setProfile] = usePersistedState<ProfileType>("profile", {
    sub: "",
    name: "",
    given_name: "",
    family_name: "",
    picture: "",
    email: "",
    email_verified: false,
  });

  const [token, setToken] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //modifying store
  const dispatch = useAppDispatch();

  //getting various redux state variables
  const profileData = useAppSelector((state) => state.profile);
  const locationCode = useAppSelector((state) => state.location);
  const searchState = useAppSelector((state) => state.search.searchString);

  //space separated list of scopes required for project itself
  const scope =
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit";

  // sending code to backend to fetch and decrypt tokens
  const validateCode = async (res: CodeResponse) => {
    const response = await fetch("https://localhost:8089/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(res),
    });
    const tokens = await response.json();
    dispatch(addToken(tokens));
    setToken(tokens); //setting it on localStorage
  };

  //click function for initiating google login, post method to backend
  const googleLogin = useGoogleLogin({
    scope, //main problem i faced is not mentioning scope in this hook
    onSuccess: (res: CodeResponse) => {
      validateCode(res);
    },
    flow: "auth-code",
  });

  useQuery({
    queryKey: ["googleLogin", fetchTokens],
    queryFn: googleLogin,
    enabled: !!fetchTokens,
    refetchInterval: 3500000, //re-fetched every hour to get new access token
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  //getting google profile data using token data provided by google login function
  useEffect(() => {
    if (token?.access_token) {
      (async () => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token?.access_token}`
          );
          if (!response.ok) {
            throw new Error("Oh no! haven't found access token yet");
          }
          const profile = await response.json();
          dispatch(addProfile(profile));
          setProfile(profile); //setting it on localStorage
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [token?.access_token]);

  //getting country code using location coordinates
  useEffect(() => {
    (async () => {
      try {
        if (locationCoords.latitude > 0 && locationCoords.longitude > 0) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${locationCoords.latitude}&lon=${locationCoords.longitude}&format=json`
          );
          const coordsDetails = await res.json();
          dispatch(getLocationData(coordsDetails));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [locationCoords]);

  //effect for clearing home videos when user leaves home route, checks when user in player route(collapse sidebar)
  useEffect(() => {
    if (location.pathname !== "/home") dispatch(clearHomeVideos());
    if (location.pathname.includes("/video")) dispatch(collapse());
    if (location.pathname !== "playlist") dispatch(clearPlayItems());
    if (!location.pathname.includes("/video")) {
      dispatch(clearCommentsThread());
      dispatch(removeTimestamp());
      dispatch(expand());
    }
  }, [location.pathname]);

  return (
    <header className="flex items-center justify-between px-2 py-1 glass">
      <div className="flex items-center justify-between gap-6">
        <div
          //toggling hamburger menu
          onClick={() => dispatch(toggle())}
          className="grid w-10 h-10 transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
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
          <div className="self-start text-xs text-slate-400">
            {locationCode.address.country_code.toUpperCase() || ""}
          </div>
        </NavLink>
      </div>
      {/* various logic used to make search bar */}
      <div className="flex items-stretch w-1/3 overflow-hidden transition rounded-full glass-dark hover:outline focus:outline outline-1 outline-zinc-600">
        <input
          onChange={(e) => {
            //toggles if search bar is clear or not
            setClearSearch(e.target.value !== "" ? true : false);

            //adds input string to searchString redux store
            dispatch(addSearchString(e?.target?.value));
            if (e?.target?.value === "") dispatch(clearSearchList());
          }}
          //if user clicks enter we navigate to search route
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("search");
          }}
          type="text"
          name="search"
          id="search"
          value={searchState}
          placeholder="Search anything..."
          className="w-full h-full py-2 pl-4 pr-12 font-semibold bg-transparent"
        />

        <div
          onClick={() => {
            dispatch(clearSearchList());
            setClearSearch(false);
          }}
          className={`absolute ${
            !clearSearch ? "hidden" : "grid"
          } transition -translate-y-1/2 rounded-full cursor-pointer right-20 top-1/2 min-w-8 min-h-8 aspect-square place-items-center hover:bg-zinc-500/50 focus:bg-zinc-500/50`}
        >
          <PiX className="w-7 h-7" />
        </div>
        <div
          id="searchButton"
          onClick={() => navigate("search")}
          className="grid w-20 transition bg-opacity-0 border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
        >
          <MdOutlineSearch className="w-6 h-6" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 mx-2 min-h-12">
          {/* <div className="grid transition bg-opacity-0 rounded-full cursor-pointer w-9 h-9 place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400">
            <AiOutlineVideoCameraAdd className="w-full h-full p-2.5" />
          </div> */}
          {/* google login button */}
          <div
            onClick={() => setFetchTokens(!fetchTokens)}
            className="grid w-10 h-10 overflow-hidden transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black outline outline-[0.1px] outline-zinc-700"
          >
            {profileData?.picture ? (
              <img src={profile?.picture} alt={profile?.name[0]} />
            ) : (
              <PiUserCirclePlusFill className="w-full h-full p-1" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
