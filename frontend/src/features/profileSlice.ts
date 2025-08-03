import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ProfileType } from "../types/types";

const initialState: ProfileType = {
  sub: "",
  name: "",
  given_name: "",
  family_name: "",
  picture: "",
  email: "",
  email_verified: false,
  channelId: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    //adding profile data in redux store
    addProfile: (state, action: PayloadAction<ProfileType>) => {
      const {
        sub,
        name,
        given_name,
        family_name,
        picture,
        email,
        email_verified,
      } = action.payload;
      Object.assign(state, {
        sub,
        name,
        given_name,
        family_name,
        picture,
        email,
        email_verified,
      });
    },

    //adding users channelId
    addChannelId: (state, action: PayloadAction<string>) => {
      state.channelId = action.payload;
    },
  },
});

export const { addProfile, addChannelId } = profileSlice.actions;

export const profile = (state: RootState) => state.profile;

export default profileSlice.reducer;
