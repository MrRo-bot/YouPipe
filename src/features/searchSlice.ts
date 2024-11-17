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

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    //adding search results in redux store
    addSearch: (state, action: PayloadAction<SearchListType>) => {
      const {
        kind,
        etag,
        nextPageToken,
        prevPageToken,
        regionCode,
        pageInfo,
        items,
      } = action.payload;
      Object.assign(state, {
        kind,
        etag,
        nextPageToken,
        prevPageToken,
        regionCode,
        pageInfo,
        items: [
          ...(state?.kind === "" ? state.items.slice(1) : state.items),
          ...items,
        ],
      });
    },
    addSearchString: (state, action) => {
      state.searchString = action.payload;
    },
  },
});

export const { addSearch, addSearchString } = searchSlice.actions;

export const search = (state: RootState) => state.search;

export default searchSlice.reducer;
