import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { LocationType } from "../types/types";

const initialState: LocationType = {
  place_id: 0,
  licence: "",
  osm_type: "",
  osm_id: 0,
  lat: 0,
  lon: 0,
  class: "",
  type: "",
  place_rank: 0,
  importance: 0,
  addresstype: "",
  name: "",
  display_name: "",
  address: {
    city_district: "",
    city: "",
    county: " ",
    state_district: "",
    state: " ",
    "ISO3166-2-lvl4": "",
    postcode: "",
    country: "",
    country_code: "",
  },
  boundingbox: [],
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    getLocationData: (state, action: PayloadAction<LocationType>) => {
      const payloadObject = action.payload;
      Object.assign(state, payloadObject);
    },
  },
});

export const { getLocationData } = locationSlice.actions;

export const location = (state: RootState) => state.location;

export default locationSlice.reducer;
