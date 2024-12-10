import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import { useAppDispatch, useAppSelector } from "../app/store";

// import Filters from "../components/Filters";
import { addHomeVideos } from "../features/homeSlice";
import VideoList from "../components/video/VideoList";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { TokensType } from "../types/types";
import { nanoid } from "@reduxjs/toolkit";

const Home = () => {
  //intersection observer
  const { ref, inView } = useInView();

  //sidebar
  const isOpen = useAppSelector((state) => state.hamburger);

  //redux dispatch
  const dispatch = useAppDispatch();

  //profile data from redux store
  const profileData = useAppSelector((state) => state.profile);
  const homeData = useAppSelector((state) => state.home);

  //getting access token from localStorage
  const [tokenData] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //fetching search list using query string
  // useQuery({
  //   queryKey: ["home", inView],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&key=${
  //         import.meta.env.VITE_API_KEY
  //       }&pageToken=${inView ? homeData?.nextPageToken : ""}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Host: "www.googleapis.com",
  //           Authorization: `Bearer ${tokenData?.access_token}`,
  //         },
  //       }
  //     );
  //     const home = await res.json();
  //     dispatch(addHomeVideos(home));
  //     return home;
  //   },
  //   enabled: !!inView,
  //   refetchOnWindowFocus: false,
  // });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className={`relative ml-4 mt-3 mr-2 mb-2 max-h-[90vh] ${
          !isOpen ? "w-[85vw]" : "w-full"
        }  overflow-y-auto hideScrollbar rounded-xl`}
      >
        {/* {profileData?.email && <Filters />} */}

        <div className="grid grid-flow-row py-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {profileData?.email && (
            <>
              {homeData?.items?.length <= 1 ? (
                <div ref={ref} className="col-start-1 mx-auto -col-end-1">
                  <FidgetSpinner
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="fidget-spinner-loading"
                    wrapperStyle={{}}
                    wrapperClass="fidget-spinner-wrapper"
                  />
                </div>
              ) : (
                homeData?.items?.map((video) => (
                  <VideoList key={nanoid()} video={video} />
                ))
              )}
            </>
          )}
          {!profileData?.email && (
            <div className="col-start-1 px-20 pt-5 pb-3 mx-auto text-center -col-end-1 w-max glass">
              <strong className="block text-3xl tracking-wider">
                Login to get started.
              </strong>
              <i className="block pt-4">Start searching videos you love.</i>
            </div>
          )}
        </div>
        {homeData?.items && homeData?.items?.length > 1 && (
          <div ref={ref}>
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
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
