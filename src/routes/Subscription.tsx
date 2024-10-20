import { AnimatePresence, motion } from "framer-motion";
import SubscriptionCard from "../components/SubscriptionCard";
import { MdKeyboardArrowDown } from "react-icons/md";

const Subscription = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="relative mb-2 mt-3 max-h-[90vh] mx-auto w-1/2 overflow-y-auto hideScrollbar rounded-xl"
      >
        <div className="flex flex-col items-start justify-between px-2 py-3">
          <h1 className="text-4xl font-bold tracking-tight text-center text-slate-200">
            All Subscriptions
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 mt-5 font-medium rounded-md cursor-pointer bg-zinc-800 max-w-max">
            Recently added <MdKeyboardArrowDown className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-2">
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
          <SubscriptionCard />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Subscription;
