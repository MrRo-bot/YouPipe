import { AnimatePresence, motion } from "framer-motion";
import { PiGridFourFill, PiListFill } from "react-icons/pi";
import VideoCard from "../components/VideoCard";

// CREATE SUBSCRIPTION COMPONENT LIKE VIDEOCARD FOR GRID VIEW AND LIST VIEW ME CARD BOTH ARE DIFFERENT

const Subscription = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="relative ml-4 mb-2 mt-3 max-h-[90vh] w-full overflow-y-auto hideScrollbar rounded-xl"
      >
        <div className="flex items-center justify-between px-2 py-3">
          <h1 className="text-xl font-bold text-center text-slate-200">
            Subscribers Uploads
          </h1>
          <div className="flex items-center justify-between gap-3">
            <div className="grid w-12 h-12 transition rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
              <PiGridFourFill className="w-6 h-6" />
            </div>

            <div className="grid w-12 h-12 transition rounded-full cursor-pointer place-items-center hover:bg-zinc-200 focus:bg-zinc-200 hover:text-black focus:text-black">
              <PiListFill className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="grid grid-flow-row p-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Subscription;
