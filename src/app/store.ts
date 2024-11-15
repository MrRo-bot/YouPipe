import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import hamburgerMenuSlice from "../features/hamburgerMenuSlice";
import profileSlice from "../features/profileSlice";
import tokenSlice from "../features/tokenSlice";
import subscriptionSlice from "../features/subscriptionSlice";
import playlistsSlice from "../features/playlistsSlice";
import likedVideosSlice from "../features/likedVideosSlice";
import locationSlice from "../features/locationSlice";

//all reducers for various data stores
export const store = configureStore({
  reducer: {
    hamburger: hamburgerMenuSlice,
    profile: profileSlice,
    token: tokenSlice,
    subscription: subscriptionSlice,
    playlist: playlistsSlice,
    likedVideos: likedVideosSlice,
    location: locationSlice,
  },
});

// Infering the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Using throughout my app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
