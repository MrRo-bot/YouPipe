import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {},
});

export const {} = channelSlice.actions;

export const channel = (state: RootState) => state.channel;

export default channelSlice.reducer;
