import { useRouteError } from "react-router-dom";
import { ErrorTypes } from "../types/types";

export default function ErrorPage() {
  const error = useRouteError() as ErrorTypes;
  console.error(error);

  return (
    <div className="grid h-[90vh] place-items-center text-zinc-200">
      <div className="flex flex-col gap-12 text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="font-semibold text-slate-200">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-slate-300">
          <i>{error?.statusText || error?.error.message}</i>
        </p>
      </div>
    </div>
  );
}
