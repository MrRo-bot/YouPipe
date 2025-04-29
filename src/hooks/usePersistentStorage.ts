/* eslint-disable react-hooks/exhaustive-deps */
//custom hook for storing fetched information in localStorage
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getItem = (key: string) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      bodyClassName: "text-purple-700 font-semibold",
      transition: Bounce,
    });
  }
};
const setItem = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      bodyClassName: "text-purple-700 font-semibold",
      transition: Bounce,
    });
  }
};

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const item = getItem(key);
    return (item as T) || initialValue;
  });

  useEffect(() => {
    setItem(key, value);
  }, [value]);

  return [value, setValue] as const;
}
