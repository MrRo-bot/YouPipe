import { configureStore } from "@reduxjs/toolkit";
import hamburgerMenu from "../features/hamburgerMenuSlice";
import subscriptions from "../features/subscriptionSlice";
import credentialsSlice from "../features/credentialsSlice";
import profileSlice from "../features/profileSlice";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerMenu,
    credentials: credentialsSlice,
    profile: profileSlice,
    subscription: subscriptions,
  },
});
