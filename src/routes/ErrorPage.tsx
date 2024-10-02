import { useRouteError } from "react-router-dom";
import { ErrorProps } from "../Types/types";

export default function ErrorPage() {
  const error = useRouteError() as ErrorProps;
  console.error(error);

  return (
    <div className="grid w-screen h-screen place-items-center">
      <div className="flex flex-col gap-12 text-center">
        <h1 className="text-4xl font-extrabold">Oops!</h1>
        <p className="font-semibold text-slate-800">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-slate-500">
          <i>{error.statusText || error.error.message}</i>
        </p>
      </div>
    </div>
  );
}
