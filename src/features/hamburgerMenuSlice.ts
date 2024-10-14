import { createSlice } from "@reduxjs/toolkit";

export const hamburgerMenuSlice = createSlice({
  name: "hamburgerMenu",
  initialState: {
    isOpen: true,
  },
  reducers: {
    toggle: (state) => {
      state.isOpen = state.isOpen ? false : true;
    },
  },
});

export const { toggle } = hamburgerMenuSlice.actions;

export default hamburgerMenuSlice.reducer;
