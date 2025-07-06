import { useEffect, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addHomeVideos } from "../features/homeSlice";

import { usePersistedState } from "../hooks/usePersistentStorage";

// import Filters from "../components/home/Filters";
import HomeCard from "../components/home/HomeCard";

import { TokensType } from "../types/types";

const Home = () => {
  const [fetchMore, setFetchMore] = useState(false);

  const profileData = useAppSelector((state) => state.profile);
  const tokenData = useAppSelector((state) => state.token);
  const isOpen = useAppSelector((state) => state.hamburger);
  const homeData = useAppSelector((state) => state.home);
  const location = useAppSelector((state) => state.location);

  const dispatch = useAppDispatch();

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const homeParts = ["contentDetails", "id", "snippet", "status", "statistics"];

  useEffect(() => {
    setFetchMore(profileData?.email.length > 1 ? true : false);
  }, [profileData?.email]);

  //fetching videos based on region for home page
  useQuery({
    queryKey: ["home", fetchMore],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?part=${homeParts.join(
            ","
          )}&chart=mostPopular&maxResults=50&key=${
            import.meta.env.VITE_API_KEY
          }&regionCode=${location.address.country_code}&pageToken=${
            fetchMore ? homeData?.nextPageToken : ""
          }
        `,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error fetching home page videos");
        const channelVideos = await res.json();
        dispatch(addHomeVideos(channelVideos));
        setFetchMore(false);
        return channelVideos;
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
    },
    enabled: !!fetchMore,
  });

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`relative ml-4 mt-3 mr-2 mb-2  ${
        !isOpen ? "w-[85vw]" : "w-full"
      }  overflow-y-auto hideScrollbar rounded-xl`}
    >
      {/* {profileData?.email && <Filters />} */}

      {profileData?.email && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
          className="m-1 text-xl font-bold tracking-tight md:m-2 md:text-2xl xl:text-4xl xl:m-4 text-slate-200"
        >
          Most Popular Videos
        </motion.h1>
      )}
      {!profileData?.email && !tokenData?.access_token && (
        <div className="col-start-1 px-6 pt-5 pb-3 mx-auto text-center transition-colors lg:px-10 xl:px-14 2xl:px-20 -col-end-1 w-max glass hover:bg-indigo-600/20 focus:bg-indigo-600/20">
          <strong className="block text-xl tracking-wider md:text-2xl 2xl:text-3xl">
            <div
              style={{ animationDelay: "0ms" }}
              className="inline-block transition-all slideIn"
            >
              L
            </div>
            <div
              style={{ animationDelay: "50ms" }}
              className="inline-block transition-all slideIn"
            >
              o
            </div>
            <div
              style={{ animationDelay: "100ms" }}
              className="inline-block transition-all slideIn"
            >
              g
            </div>
            <div
              style={{ animationDelay: "150ms" }}
              className="inline-block transition-all slideIn"
            >
              i
            </div>
            <div
              style={{ animationDelay: "200ms" }}
              className="inline-block transition-all slideIn"
            >
              n
            </div>
            <div className="inline-block">&nbsp;</div>
            <div
              style={{ animationDelay: "300ms" }}
              className="inline-block transition-all slideIn"
            >
              t
            </div>
            <div
              style={{ animationDelay: "350ms" }}
              className="inline-block transition-all slideIn"
            >
              o
            </div>
            <div className="inline-block">&nbsp;</div>
            <div
              style={{ animationDelay: "450ms" }}
              className="inline-block transition-all slideIn"
            >
              g
            </div>
            <div
              style={{ animationDelay: "500ms" }}
              className="inline-block transition-all slideIn"
            >
              e
            </div>
            <div
              style={{ animationDelay: "550ms" }}
              className="inline-block transition-all slideIn"
            >
              t
            </div>
            <div className="inline-block">&nbsp;</div>
            <div
              style={{ animationDelay: "650ms" }}
              className="inline-block transition-all slideIn"
            >
              s
            </div>
            <div
              style={{ animationDelay: "700ms" }}
              className="inline-block transition-all slideIn"
            >
              t
            </div>
            <div
              style={{ animationDelay: "750ms" }}
              className="inline-block transition-all slideIn"
            >
              a
            </div>
            <div
              style={{ animationDelay: "800ms" }}
              className="inline-block transition-all slideIn"
            >
              r
            </div>
            <div
              style={{ animationDelay: "850ms" }}
              className="inline-block transition-all slideIn"
            >
              t
            </div>
            <div
              style={{ animationDelay: "900ms" }}
              className="inline-block transition-all slideIn"
            >
              e
            </div>
            <div
              style={{ animationDelay: "950ms" }}
              className="inline-block transition-all slideIn"
            >
              d
            </div>
            <div
              style={{ animationDelay: "1000ms" }}
              className="inline-block transition-all slideIn"
            >
              .
            </div>
          </strong>
          <i className="block pt-4">Start searching videos you love.</i>
        </div>
      )}

      {homeData?.items?.length <= 1 ? (
        profileData?.email && (
          <div className="w-full">
            <FidgetSpinner
              visible={true}
              height="80"
              width="80"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper mx-auto"
            />
          </div>
        )
      ) : (
        <VirtuosoGrid
          className="!w-full !hideScrollbar"
          listClassName="grid grid-flow-row min-h-[85vh] gap-2 2xl:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3"
          data={homeData?.items}
          totalCount={homeData?.pageInfo?.totalResults || 0}
          endReached={() => setTimeout(() => setFetchMore(true), 1000)}
          context={homeData}
          components={{
            Footer: ({ context: homeData }) => {
              const total = homeData?.pageInfo?.totalResults || 0;
              return homeData && homeData?.items?.length < total ? (
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="#3bf6fcbf"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass="justify-center py-2"
                />
              ) : (
                <div className="py-1 mx-auto text-lg italic font-bold w-max">
                  That's All
                </div>
              );
            },
          }}
          itemContent={(_, homeItem) => <HomeCard video={homeItem} />}
        />
      )}
    </motion.div>
  );
};

export default Home;
