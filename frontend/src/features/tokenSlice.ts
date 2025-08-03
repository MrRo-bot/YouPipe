import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { TokensType } from "../types/types";

const initialState: TokensType = {
  access_token: "",
  refresh_token: "",
  scope: "",
  token_type: "",
  id_token: "",
  expiry_date: 0,
};

export const tokenSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    //adding token data in redux store
    addToken: (state, action: PayloadAction<TokensType>) => {
      const {
        access_token,
        refresh_token,
        scope,
        token_type,
        id_token,
        expiry_date,
      } = action.payload;
      Object.assign(state, {
        access_token,
        refresh_token,
        scope,
        token_type,
        id_token,
        expiry_date,
      });
    },
  },
});

export const { addToken } = tokenSlice.actions;

export const token = (state: RootState) => state.token;

export default tokenSlice.reducer;
