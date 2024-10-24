import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import hamburgerMenuSlice from "../features/hamburgerMenuSlice";
import profileSlice from "../features/profileSlice";
import tokenSlice from "../features/tokenSlice";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerMenuSlice,
    profile: profileSlice,
    token: tokenSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
