import { AnimatePresence, motion } from "framer-motion";

const PlaylistOverview = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className=""
      ></motion.div>
    </AnimatePresence>
  );
};

export default PlaylistOverview;
