import { configureStore } from "@reduxjs/toolkit";
import hamburgerMenu from "../features/hamburgerMenuSlice";
import subscriptionSlice from "../features/subscriptionSlice";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerMenu,
    subscription: subscriptionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
