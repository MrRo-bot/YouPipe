import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

const initialState: { isOpen: boolean } = {
  isOpen: true,
};

export const hamburgerMenuSlice = createSlice({
  name: "hamburgerMenu",
  initialState,
  reducers: {
    //toggling sidebar menu (expanded or shrunk)
    toggle: (state) => {
      state.isOpen = state.isOpen ? false : true;
    },
    collapse: (state) => {
      state.isOpen = false;
    },
    expand: (state) => {
      state.isOpen = true;
    },
  },
});

export const { toggle, collapse, expand } = hamburgerMenuSlice.actions;

export const isOpen = (state: RootState) => state.hamburger.isOpen;

export default hamburgerMenuSlice.reducer;
