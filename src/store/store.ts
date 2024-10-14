import { configureStore } from "@reduxjs/toolkit";
import hamburgerMenu from "../features/hamburgerMenuSlice";

export default configureStore({
  reducer: {
    hamburger: hamburgerMenu,
  },
});
