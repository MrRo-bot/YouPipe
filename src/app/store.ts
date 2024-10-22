import { configureStore } from "@reduxjs/toolkit";
import hamburgerMenu from "../features/hamburgerMenuSlice";
import subscriptions from "../features/subscriptionSlice";
import profileSlice from "../features/profileSlice";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerMenu,
    profile: profileSlice,
    subscription: subscriptions,
  },
});
