import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addHomeVideos } from "../features/homeSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import { TokensType } from "../types/types";
import Filters from "../components/home/Filters";
import VideoList from "../components/home/VideoList";

const Home = () => {
  const { ref, inView } = useInView();

  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.hamburger);
  const profileData = useAppSelector((state) => state.profile);
  const homeData = useAppSelector((state) => state.home);

  const [token] = usePersistedState<TokensType>("token", {
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
  //           Authorization: `Bearer ${token?.access_token}`,
  //         },
  //       }
  //     );
  //     const home = await res.json();
  //     dispatch(addHomeVideos(home));
  //     return home;
  //   },
  //   enabled: !!inView,
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
        {profileData?.email && <Filters />}

        <div className="grid grid-flow-row py-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {profileData?.email && (
            <>
              {homeData?.items?.length < 1 ? (
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
                  <VideoList key={video?.etag} video={video} />
                ))
              )}
            </>
          )}
          {!profileData?.email && (
            <div className="col-start-1 px-20 pt-5 pb-3 mx-auto text-center -col-end-1 w-max glass">
              <strong className="block text-3xl tracking-wider">
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
