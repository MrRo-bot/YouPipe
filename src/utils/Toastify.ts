import { Bounce, toast, ToastContent } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customToastFunction = (message: ToastContent<unknown>, type?: string) => {
  return type === "error"
    ? toast.error(message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      })
    : toast(message, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        className: "!toastGradient !font-bold !text-zinc-50",
        transition: Bounce,
      });
};

export default customToastFunction;
