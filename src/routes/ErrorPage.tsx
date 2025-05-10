import { Link, useRouteError } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { ErrorType } from "../types/types";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Error page for routing errors only
export default function ErrorPage() {
  const error = useRouteError() as ErrorType;
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="grid h-[90vh] place-items-center text-zinc-200"
      >
        <div className="flex flex-col w-1/4 gap-12 text-center">
          <img src="/404.svg" alt="" />
          <div className="flex flex-col gap-2">
            <span className="text-xl font-medium text-purple-300">
              Message from console:{"  "}
            </span>
            <span className="text-3xl font-black text-blue-300">
              <code>
                {(!error && "unexpected error in program") ||
                  (error && error?.statusText) ||
                  error?.error?.message}
              </code>
            </span>
          </div>
          <Link
            to="/"
            className="self-end px-3 py-2 mx-auto font-bold transition-all duration-300 ease-in-out rounded-full cursor-pointer hover:bg-zinc-50 hover:text-purple-900 hover:scale-105 bg-pink-500/50 text-zinc-50 w-max"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
