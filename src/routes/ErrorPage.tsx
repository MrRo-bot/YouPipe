import { Link, useRouteError } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type ErrorType =
  | {
      statusText?: string;
      error?: { message: string };
      message?: string;
    }
  | Error;

export default function ErrorPage() {
  const error = useRouteError() as ErrorType;

  const errorMessage =
    error instanceof Error
      ? error.message
      : error?.statusText ||
        error?.error?.message ||
        "Unexpected error in program";

  useEffect(() => {
    const toastId = "error-toast";
    if (!toast.isActive(toastId)) {
      toast.error(`❌ ${errorMessage}`, {
        toastId,
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
  }, [errorMessage]);

  return (
    <AnimatePresence>
      <motion.div
        key="error-page"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="grid h-[90vh] place-items-center text-zinc-200"
      >
        <div className="flex flex-col w-full gap-12 text-center sm:w-1/2 md:w-1/3">
          <img src="/404.svg" alt="404 error illustration" />
          <div className="flex flex-col gap-2">
            <span className="text-xl font-medium text-purple-300">
              Message from console:
            </span>
            <span className="text-3xl font-black text-blue-300">
              <code>{errorMessage}</code>
            </span>
          </div>
          <Link
            to=""
            className="self-end px-3 py-2 mx-auto font-bold transition-all duration-300 ease-in-out rounded-full cursor-pointer hover:bg-zinc-50 hover:text-purple-900 hover:scale-105 bg-pink-500/50 text-zinc-50 w-max"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
