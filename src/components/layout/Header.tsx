/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  useGoogleLogin,
  googleLogout,
  CodeResponse,
} from "@react-oauth/google";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PiUserCirclePlusFill, PiX } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { useAppDispatch, useAppSelector } from "../../app/store";
import { collapse, expand, toggle } from "../../features/hamburgerMenuSlice";
import { addProfile } from "../../features/profileSlice";
import { addToken } from "../../features/tokenSlice";
import {
  addSearchString,
  clearSearchList,
  refetch,
} from "../../features/searchSlice";
import { getLocationData } from "../../features/locationSlice";
import { clearCommentsThread } from "../../features/commentsThreadSlice";
import { clearHomeVideos } from "../../features/homeSlice";
import { removeTimestamp } from "../../features/timestampSlice";
import { clearPlayItems } from "../../features/playlistOverviewSlice";
import { clearLikedVideos } from "../../features/likedVideosSlice";
import { clearChannel } from "../../features/channelOverviewSlice";
import { usePersistedState } from "../../hooks/usePersistentStorage";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { ProfileType, TokensType } from "../../types/types";

const Header = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [clearSearch, setClearSearch] = useState(false);
  const [fetchTokens, setFetchTokens] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const locationCoords = useCurrentLocation();

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

  const dispatch = useAppDispatch();
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

    toast("🪙 Access token received!", {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      className: "!toastGradient !font-bold !text-zinc-50",
      transition: Bounce,
    });
    setToken(tokens);
  };

  //click function for initiating google login, post method to backend
  const googleLogin = useGoogleLogin({
    scope, //main problem i faced is not mentioning scope in this hook
    onSuccess: (res: CodeResponse) => {
      validateCode(res);
    },
    flow: "auth-code",
  });

  useEffect(() => {
    googleLogin();
  }, [fetchTokens]);

  //========================================================================================================================================
  //refresh token
  // const waitTime = 350000;
  // let executionTime;
  // const initialTime = localStorage.getItem("initialTime");
  // if (initialTime === null) {
  //   localStorage.setItem("initialTime", new Date().getTime());
  //   executionTime = waitTime;
  // } else {
  //   executionTime = parseInt(initialTime, 10) + waitTime - new Date().getTime();
  //   if (executionTime < 0) executionTime = 0;
  // }

  // useEffect(() => {
  //   setInterval(function () {
  //     refetch();
  //     // reset the timeout to start from waitTime on page reload
  //     localStorage.removeItem("initialTime");
  //   }, executionTime);
  // }, []);

  // ========================================================================================================================================

  const logout = () => {
    googleLogout();
    setProfile({
      sub: "",
      name: "",
      given_name: "",
      family_name: "",
      picture: "",
      email: "",
      email_verified: false,
    });
    setToken({
      access_token: "",
      refresh_token: "",
      scope: "",
      token_type: "",
      id_token: "",
      expiry_date: 0,
    });
    window.location.reload();
  };

  //focus on search bar using cmd / ctrl + k
  useEffect(() => {
    const handleKeyDown = (e: {
      ctrlKey: boolean;
      key: string;
      preventDefault: () => void;
    }) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault(); // Prevent browser's default behavior
        // searchRef.current.focus();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (token?.access_token) {
      (async () => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token?.access_token}`
          );
          if (!response.ok) {
            throw new Error("❌ No access token");
          }
          const profile = await response.json();
          dispatch(addProfile(profile));
          setProfile(profile); //setting it on localStorage
          //react toastify notification for welcoming user
          if (profile?.name?.length > 1) {
            toast(`Welcome ${profile?.name?.split(" ")[0]} 🥳 enjoy!!`, {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              className: "!toastGradient !font-bold !text-zinc-50",
              transition: Bounce,
            });
          }
        } catch (error) {
          //react toastify notification for access token error
          toast.error(`${error instanceof Error ? error.message : error}!`, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "!toastGradientError !font-bold !text-zinc-50",
            transition: Bounce,
          });
        }
      })();
    }
  }, [token?.access_token]);

  useEffect(() => {
    (async () => {
      try {
        if (locationCoords.latitude > 0 && locationCoords.longitude > 0) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${locationCoords.latitude}&lon=${locationCoords.longitude}&format=json`
          );
          const coordsDetails = await res.json();
          dispatch(getLocationData(coordsDetails));
          toast("🧭 Location fetched!", {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
            className: "!toastGradient !font-bold !text-zinc-50",
          });
          return coordsDetails;
        }
      } catch (error) {
        //react toastify for location fetch errors
        toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!toastGradientError !font-bold !text-zinc-50",
          transition: Bounce,
        });
      }
    })();
  }, [locationCoords]);

  //effect for clearing redux store parts depending upon which route user currently is
  useEffect(() => {
    if (location.pathname !== "/home") dispatch(clearHomeVideos());
    if (location.pathname.includes("/video")) dispatch(collapse());
    if (location.pathname !== "playlist") dispatch(clearPlayItems());
    if (!location.pathname.includes("/video")) {
      dispatch(clearCommentsThread());
      dispatch(removeTimestamp());
      dispatch(expand());
    }
    if (!location.pathname.includes("/channel")) {
      dispatch(clearChannel());
    }
    if (!location.pathname.includes("/likedvideos")) {
      dispatch(clearLikedVideos());
    }
  }, [location.pathname]);

  return (
    <header className="flex items-center justify-between px-5 py-1 glass">
      <div className="flex items-center justify-between gap-3">
        <div
          onClick={() => dispatch(toggle())}
          className="grid w-10 h-10 transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
        >
          <RxHamburgerMenu className="w-full h-full p-2.5" />
        </div>
        <NavLink className="flex items-center min-h-10" to="/">
          <div className="w-8 h-8">
            <img
              referrerPolicy="no-referrer"
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
      <div className="flex items-stretch w-1/3 overflow-hidden transition rounded-full glass-dark hover:outline focus:outline outline-1 outline-zinc-600">
        <input
          ref={searchRef}
          onChange={(e) => {
            setClearSearch(e.target.value !== "" ? true : false);
            dispatch(addSearchString(e?.target?.value));
            if (e?.target?.value === "") dispatch(clearSearchList());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate("search");
              dispatch(refetch(true));
            }
          }}
          type="text"
          name="search"
          id="search"
          value={searchState}
          placeholder="Search anything... | ctrl + k to focus"
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
          onClick={() => {
            navigate("search");
            dispatch(refetch(true));
          }}
          className="grid w-20 transition bg-opacity-0 border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
        >
          <MdOutlineSearch className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {profileData?.picture && (
          <div
            onClick={logout}
            className="hover:bg-zinc-100 focus:bg-zinc-100 p-1.5 rounded-md transition tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-100 glass"
          >
            Logout
          </div>
        )}
        <div className="flex items-center gap-4 mx-2 min-h-12">
          <div className="grid w-10 h-10 overflow-hidden transition bg-opacity-0 rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black outline outline-[0.1px] outline-zinc-700">
            {profileData?.picture ? (
              <img
                referrerPolicy="no-referrer"
                src={profile?.picture}
                alt={profile?.name[0]}
              />
            ) : (
              <PiUserCirclePlusFill
                onClick={() => setFetchTokens(!fetchTokens)}
                className="w-full h-full p-1"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
