import { AnimatePresence, motion } from "framer-motion";

import VideoCard from "../components/VideoCard";
import { useAppSelector } from "../app/store";
import Filters from "../components/Filters";

const Home = () => {
  const isOpen = useAppSelector((state) => state.hamburger);
  const profileData = useAppSelector((state) => state.profile);

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
          {profileData?.email ? (
            <>
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
            </>
          ) : (
            <div className="col-start-1 px-20 pt-5 pb-3 mx-auto text-center -col-end-1 glass">
              <strong className="block text-3xl tracking-wider">
                Login to get started.
              </strong>
              <i className="block pt-4">Start searching videos you love.</i>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
