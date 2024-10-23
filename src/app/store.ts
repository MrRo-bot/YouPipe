import { configureStore } from "@reduxjs/toolkit";
import hamburgerMenu from "../features/hamburgerMenuSlice";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerMenu,
  },
});
