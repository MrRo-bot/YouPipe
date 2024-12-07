import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { PlaylistItemListType } from "../types/types";

const initialState: PlaylistItemListType = {
  kind: "",
  etag: "",
  nextPageToken: "",
  prevPageToken: "",
  pageInfo: {
    totalResults: 0,
    resultsPerPage: 0,
  },
  items: [
    {
      kind: "",
      etag: "",
      id: "",
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
        videoOwnerChannelTitle: "",
        videoOwnerChannelId: "",
        playlistId: "",
        position: 0,
        resourceId: {
          kind: "",
          videoId: "",
        },
      },
      status: {
        privacyStatus: "",
      },
      contentDetails: {
        videoId: "",
        startAt: "",
        endAt: "",
        note: "",
        videoPublishedAt: 0,
      },
    },
  ],
};

export const PlaylistOverview = createSlice({
  name: "playlistoverview",
  initialState,
  reducers: {
    //adding playlist overview data in redux store
    addPlayItems: (state, action) => {
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
    clearPlayItems: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { addPlayItems, clearPlayItems } = PlaylistOverview.actions;

export const playlistOverview = (state: RootState) => state.playlistOverview;

export default PlaylistOverview.reducer;
