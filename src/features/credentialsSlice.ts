import { createSlice } from "@reduxjs/toolkit";
import { CredentialType } from "../types/types";

const initialState = {
  access_token: "",
  token_type: "",
  expires_in: 0,
  scope: "",
  authuser: "",
  prompt: "",
};

export const credentialsSlice = createSlice({
  name: "credentials",
  initialState,
  reducers: {
    addCredentials: (state, action) => {
      const { access_token, token_type, expires_in, scope, authuser, prompt } =
        action.payload;
      const credentialsData: CredentialType = {
        access_token: access_token,
        token_type: token_type,
        expires_in: expires_in,
        scope: scope,
        authuser: authuser,
        prompt: prompt,
      };
      localStorage.setItem("credentials", JSON.stringify(credentialsData));
      Object.assign(state, {
        access_token,
        token_type,
        expires_in,
        scope,
        authuser,
        prompt,
      });
    },
  },
});

export const { addCredentials } = credentialsSlice.actions;

export default credentialsSlice.reducer;
