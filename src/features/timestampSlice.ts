import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

const initialState = {
  value: 0,
};

export const timestampSlice = createSlice({
  name: "timestamp",
  initialState,
  reducers: {
    //adding timestamp value for react player
    addTimestamp: (state, action) => {
      state.value = action.payload;
    },
    removeTimestamp: (state) => {
      state.value = 0;
    },
  },
});

export const { addTimestamp, removeTimestamp } = timestampSlice.actions;

export const value = (state: RootState) => state.timestamp;

export default timestampSlice.reducer;
