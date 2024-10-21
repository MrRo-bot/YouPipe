import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  kind: "",
  etag: "",
  nextPageToken: "",
  prevPageToken: "",
  pageInfo: {
    totalResults: 0,
    resultsPerPage: 0,
  },
  items: [],
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    getSubs: (state, action) => {
      state = action.payload;
    },
    setSub: (state) => {
      return state;
    },
    removeSub: (state) => {
      return state;
    },
  },
});

export const { getSubs, setSub, removeSub } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
