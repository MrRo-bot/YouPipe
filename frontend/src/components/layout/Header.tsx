import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  useGoogleLogin,
  googleLogout,
  CodeResponse,
} from "@react-oauth/google";

import { PiUserCirclePlusFill, PiX } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { useAppDispatch, useAppSelector } from "../../app/store";
import { collapse, expand, toggle } from "../../features/hamburgerMenuSlice";
import { addChannelId, addProfile } from "../../features/profileSlice";
import { addToken } from "../../features/tokenSlice";
import {
  addSearchString,
  clearSearchList,
  refetch,
} from "../../features/searchSlice";
import { clearCommentsThread } from "../../features/commentsThreadSlice";
import { removeTimestamp } from "../../features/timestampSlice";
import { clearPlayItems } from "../../features/playlistOverviewSlice";
import { clearLikedVideos } from "../../features/likedVideosSlice";
import { clearChannel } from "../../features/channelOverviewSlice";
import { clearSubscription } from "../../features/subscriptionSlice";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import customToastFunction from "../../utils/Toastify";

import { ProfileType, TokensType } from "../../types/types";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  const [fetchTokens, setFetchTokens] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const searchPopupRef = useRef<HTMLDialogElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

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

  //adding channelId to profile store object
  useQuery({
    queryKey: ["channelId", profileData?.email],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?mine=true&part=id`,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        const channelId = await res.json();

        if ((!res.ok && res.status >= 400) || channelId.items[0]?.id)
          throw new Error(`Error ${res.status} in fetching channel ID`);

        dispatch(addChannelId(channelId.items[0].id));
        return channelId;
      } catch (error) {
        customToastFunction(
          `❌ ${error instanceof Error ? error.message : error}`,
          "error"
        );
      }
    },
    enabled: !!profileData?.email,
    refetchOnWindowFocus: false,
  });

  //space separated list of scopes required for project itself
  const scope =
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly";

  // sending code to backend to fetch and decrypt tokens
  const validateCode = async (res: CodeResponse) => {
    const response = await fetch(
      `${
        process.env.NODE_ENV === "production"
          ? import.meta.env.VITE_BACK_URL_PROD
          : import.meta.env.VITE_BACK_URL_DEV
      }/auth/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(res),
      }
    );
    const tokens = await response.json();
    dispatch(addToken(tokens));
    customToastFunction("🪙 Access token received!");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTokens]);

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
    window.location.href = `${
      process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_FRONT_URL_PROD ||
          "https://youpipe-frontend.vercel.app"
        : import.meta.env.VITE_FRONT_URL_DEV || "https://localhost:5173"
    }`;
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

  //using access token to get youtubers profile data
  useQuery({
    queryKey: ["userProfile", token?.access_token],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token?.access_token}`
        );
        if (!res.ok && res.status >= 400) {
          throw new Error(`❌ Error ${res.status} : No access token`);
        }
        const profile = await res.json();
        dispatch(addProfile(profile));
        setProfile(profile); //setting it on localStorage
        //react toastify notification for welcoming user
        if (profile?.name?.length > 1) {
          customToastFunction(
            `Welcome ${profile?.name?.split(" ")[0]} 🥳 enjoy!!`
          );
        }
      } catch (error) {
        //react toastify notification for access token error
        customToastFunction(
          `${error instanceof Error ? error.message : error}!`,
          "error"
        );
      }
    },
    enabled: !!token?.access_token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (location.pathname !== "/search") dispatch(clearSubscription());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const dialog = searchPopupRef.current;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target === searchPopupRef.current) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const dialog = searchPopupRef.current;
    dialog?.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog?.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isTokenNearExpiry = (expiryDate: string | number) => {
    const now = Date.now();
    const expiry = new Date(expiryDate).getTime();
    return expiry - now <= EXPIRY_THRESHOLD;
  };

  const REFRESH_CHECK_INTERVAL = 60 * 1000;
  const EXPIRY_THRESHOLD = 5 * 60 * 1000;

  //refresh token using refresh token and expiry date
  useQuery({
    queryKey: ["refreshToken"],

    queryFn: async () => {
      try {
        const res = await fetch(
          `${
            process.env.NODE_ENV === "production"
              ? import.meta.env.VITE_BACK_URL_PROD
              : import.meta.env.VITE_BACK_URL_DEV
          }/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: token?.refresh_token }),
          }
        );
        if (!res.ok && res.status >= 400) {
          throw new Error(`Error ${res.status} in refreshing token`);
        }
        const newTokens = await res.json();

        dispatch(addToken(newTokens));
        customToastFunction("🪙 New access token received!");
        setToken(newTokens);
        return newTokens;
      } catch (error) {
        customToastFunction(
          `${error instanceof Error ? error.message : error}!`,
          "error"
        );
        throw error;
      }
    },

    enabled:
      !!token &&
      !!token.refresh_token &&
      !!token.expiry_date &&
      isTokenNearExpiry(token.expiry_date),

    refetchInterval: () => {
      if (!token || !token.expiry_date) return false;
      const timeUntilExpiry =
        new Date(token.expiry_date).getTime() - Date.now();
      // console.log("Time until expiry:", timeUntilExpiry / 1000 / 60, "minutes");
      //console.log(timeUntilExpiry);
      return timeUntilExpiry <= EXPIRY_THRESHOLD
        ? REFRESH_CHECK_INTERVAL
        : false;
    },

    staleTime: Infinity,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      key="header"
      className="flex items-center justify-between px-1 py-0.5 md:px-2 lg:px-3 md:py-1 transition-colors glass hover:bg-indigo-600/20 focus:bg-indigo-600/20"
    >
      <div className="flex items-center justify-between order-2 gap-3 lg:order-none">
        {window.innerWidth > 1024 && (
          <div
            onClick={() => dispatch(toggle())}
            className="grid transition-colors bg-opacity-0 rounded-full cursor-pointer size-10 place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
          >
            <RxHamburgerMenu className="w-full h-full p-2.5" />
          </div>
        )}
        <NavLink
          className="flex items-center min-h-6 md:min-h-8 lg:min-h-10"
          to="/"
        >
          <div className="size-6 md:size-7 lg:size-8">
            <img
              className="text-nowrap indent-[100%] overflow-hidden"
              src="/icon.svg"
              alt="youpipe"
            />
          </div>
          <div className="ml-1.5 text-lg font-black md:text-xl lg:text-2xl text-zinc-50 md:font-bold tracking-tighter">
            YouPipe
          </div>
          <div className="self-start text-xs text-slate-400">
            {locationCode.address.country_code.toUpperCase() || ""}
          </div>
        </NavLink>
      </div>

      {window.innerWidth > 1024 ? (
        <div className="flex items-stretch w-1/3 overflow-hidden transition-shadow rounded-full glass-dark hover:shadow-[0_0_0.5px_1px_#52525b] focus:shadow-[0_0_0.5px_1px_#52525b] active:shadow-[0_0_0.5px_1px_#52525b]">
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
            placeholder="ctrl + k to focus"
            className="w-full h-full py-2 pl-4 pr-12 font-semibold bg-transparent"
          />

          <div
            onClick={() => {
              dispatch(clearSearchList());
              setClearSearch(false);
            }}
            className={`absolute ${
              !clearSearch ? "hidden" : "grid"
            } transition-colors -translate-y-1/2 rounded-full cursor-pointer right-14 min-h-6 min-w-6 md:right-16 lg:right-20 top-1/2 md:min-h-7 md:min-w-7 lg:min-w-8 lg:min-h-8 aspect-square place-items-center hover:bg-zinc-500/50 focus:bg-zinc-500/50`}
          >
            <PiX className="size-7" />
          </div>
          <div
            id="searchButton"
            onClick={() => {
              navigate("search");
              dispatch(refetch(true));
            }}
            className="grid w-20 transition-colors bg-opacity-0 border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
          >
            <MdOutlineSearch className="size-6" />
          </div>
        </div>
      ) : (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="grid order-1 transition-colors bg-opacity-0 cursor-pointer rounded-xl size-9 place-items-center glass bg-zinc-200 active:bg-opacity-100 active:text-zinc-900 active:bg-zinc-400"
          >
            <MdOutlineSearch className="size-6" />
          </div>
          <dialog
            className="w-full p-2 overflow-hidden font-semibold flex flex-col gap-2 rounded-full heroGradient backdrop:backdrop-blur-[1px] backdrop:bg-zinc-800/20 text-zinc-100"
            ref={searchPopupRef}
          >
            <div className="flex items-stretch overflow-hidden transition-shadow rounded-full glass-dark hover:shadow-[0_0_0.5px_1px_#52525b] focus:shadow-[0_0_0.5px_1px_#52525b] active:shadow-[0_0_0.5px_1px_#52525b]">
              <input
                ref={searchRef}
                onChange={(e) => {
                  setClearSearch(e.target.value !== "" ? true : false);
                  dispatch(addSearchString(e?.target?.value));
                  if (e?.target?.value === "") dispatch(clearSearchList());
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    navigate("search");
                    dispatch(refetch(true));
                    setIsOpen(false);
                  }
                }}
                type="text"
                name="search"
                id="search"
                value={searchState}
                placeholder="ctrl + k to focus"
                className="w-full h-full p-2 pr-6 text-sm font-semibold bg-transparent"
              />

              <div
                onClick={() => {
                  dispatch(clearSearchList());
                  setClearSearch(false);
                }}
                className={`absolute ${
                  !clearSearch ? "hidden" : "grid"
                } transition-colors -translate-y-1/2 rounded-full cursor-pointer right-9 min-h-6 min-w-6 top-1/2 aspect-square place-items-center hover:bg-zinc-500/50 focus:bg-zinc-500/50`}
              >
                <PiX className="size-5" />
              </div>
              <div
                id="searchButton"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("search");
                  dispatch(refetch(true));
                  setIsOpen(false);
                }}
                className="grid w-10 transition-colors bg-opacity-0 border-l rounded-none cursor-pointer place-items-center glass border-l-zinc-600 bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black active:text-zinc-900 active:bg-zinc-400"
              >
                <MdOutlineSearch className="size-5" />
              </div>
            </div>
          </dialog>
        </>
      )}

      <div className="relative flex items-center justify-between order-3 gap-1 md:gap-2">
        {window.innerWidth > 1024 && (
          <NavLink
            style={{ position: "absolute", left: -115 + "px" }}
            to="privacy"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "text-zinc-200 text-xs font-bold"
                : "text-zinc-500 text-xs"
            }
          >
            Read Privacy Policy
          </NavLink>
        )}
        {profileData?.picture && (
          <div
            onClick={logout}
            className="hover:bg-zinc-100 focus:bg-zinc-100 p-1.5 rounded-md transition-colors tracking-tighter text-xs text-center hover:text-black focus:text-black cursor-pointer active:text-zinc-900 active:bg-zinc-100 glass"
          >
            Logout
          </div>
        )}
        <div className="flex items-center mx-0.5 min-h-9 md:mx-1 md:min-h-10 gap-4 lg:mx-2 lg:min-h-12">
          <div className="grid size-8 md:size-10 overflow-hidden transition-colors bg-opacity-0 rounded-xl md:rounded-full cursor-pointer place-items-center bg-zinc-200 hover:bg-opacity-100 focus:bg-opacity-100 hover:text-black focus:text-black outline outline-[0.5px] outline-zinc-700">
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
    </motion.header>
  );
};

export default Header;
