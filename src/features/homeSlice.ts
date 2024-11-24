import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { SearchListType } from "../types/types";

const initialState: SearchListType = {
  searchString: "",
  kind: "",
  etag: "",
  nextPageToken: "",
  prevPageToken: "",
  regionCode: "",
  pageInfo: {
    totalResults: 0,
    resultsPerPage: 0,
  },
  items: [
    {
      kind: "",
      etag: "",
      id: {
        kind: "",
        videoId: "",
        channelId: "",
        playlistId: "",
      },
      snippet: {
        publishedAt: "",
        channelId: "",
        title: "",
        description: "",
        thumbnails: {
          default: {
            url: "",
            width: 0,
            height: 0,
          },
          medium: {
            url: "",
            width: 0,
            height: 0,
          },
          high: {
            url: "",
            width: 0,
            height: 0,
          },
          standard: {
            url: "",
            width: 0,
            height: 0,
          },
          maxres: {
            url: "",
            width: 0,
            height: 0,
          },
        },
        channelTitle: "",
        liveBroadcastContent: "",
      },
    },
  ],
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    //adding home search videos list in redux store
    addHomeVideos: (state, action: PayloadAction<SearchListType>) => {
      const { kind, etag, nextPageToken, prevPageToken, pageInfo, items } =
        action.payload;

      Object.assign(state, {
        kind,
        etag,
        nextPageToken,
        prevPageToken,
        pageInfo,
        items: [
          ...(state?.kind === "" ? state.items.slice(1) : state.items),
          ...items,
        ],
      });
    },

    //clear home page list
    clearHomeVideos: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { addHomeVideos, clearHomeVideos } = homeSlice.actions;

export const home = (state: RootState) => state.home;

export default homeSlice.reducer;
