import { createSlice } from "@reduxjs/toolkit";
import { ProfileType } from "../types/types";

const initialState = {
  issuer: "",
  clientId: "",
  uniqueId: "",
  email: "",
  emailVerified: "",
  name: "",
  picture: "",
  givenName: "",
  familyName: "",
  creationTime: "",
  expiryTime: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      const {
        issuer,
        clientId,
        uniqueId,
        email,
        emailVerified,
        name,
        picture,
        givenName,
        familyName,
        creationTime,
        expiryTime,
      } = action.payload;

      const profileData: ProfileType = {
        issuer: issuer,
        clientId: clientId,
        uniqueId: uniqueId,
        email: email,
        emailVerified: emailVerified,
        name: name,
        picture: picture,
        givenName: givenName,
        familyName: familyName,
        creationTime: creationTime,
        expiryTime: expiryTime,
      };
      localStorage.setItem("profile", JSON.stringify(profileData));

      Object.assign(state, {
        issuer,
        clientId,
        uniqueId,
        email,
        emailVerified,
        name,
        picture,
        givenName,
        familyName,
        creationTime,
        expiryTime,
      });
    },
  },
});

export const { addProfile } = profileSlice.actions;

export default profileSlice.reducer;
