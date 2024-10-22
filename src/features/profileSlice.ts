import { createSlice } from "@reduxjs/toolkit";
import { ProfileType } from "../types/types";

const initialState = {
  id: "",
  email: "",
  verified_email: "",
  name: "",
  given_name: "",
  family_name: "",
  picture: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      const {
        id,
        email,
        verified_email,
        name,
        given_name,
        family_name,
        picture,
      } = action.payload;

      const profileData: ProfileType = {
        id: id,
        email: email,
        verified_email: verified_email,
        name: name,
        given_name: given_name,
        family_name: family_name,
        picture: picture,
      };
      localStorage.setItem("profile", JSON.stringify(profileData));

      Object.assign(state, {
        id,
        email,
        verified_email,
        name,
        given_name,
        family_name,
        picture,
      });
    },
  },
});

export const { addProfile } = profileSlice.actions;

export default profileSlice.reducer;
