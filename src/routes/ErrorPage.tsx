import { useRouteError } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { ErrorType } from "../types/types";

//Error page for routing errors only
export default function ErrorPage() {
  const error = useRouteError() as ErrorType;
  console.error(error);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="grid h-[90vh] place-items-center text-zinc-200"
      >
        <div className="flex flex-col gap-12 text-center">
          <h1 className="text-4xl font-bold">Oops!</h1>
          <p className="font-semibold text-slate-200">
            Sorry, an unexpected error has occurred.
          </p>
          <p className="text-slate-300">
            <i>
              {(!error && "unexpected error in program") ||
                (error && error?.statusText) ||
                error?.error?.message}
            </i>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
