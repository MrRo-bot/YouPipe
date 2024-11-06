import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { PlaylistListType } from "../types/types";

const initialState: PlaylistListType = {
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
        defaultLanguage: "",
        localized: {
          title: "",
          description: "",
        },
      },
      status: {
        privacyStatus: "",
        podcastStatus: 0,
      },
      contentDetails: {
        itemCount: 0,
      },
      player: {
        embedHtml: "",
      },
      localizations: {
        localized: {
          title: "",
          description: "",
        },
      },
    },
  ],
};

export const PlaylistsSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    addPlaylists: (state, action: PayloadAction<PlaylistListType>) => {
      const { kind, etag, nextPageToken, prevPageToken, pageInfo, items } =
        action.payload;
      Object.assign(state, {
        kind,
        etag,
        nextPageToken,
        prevPageToken,
        pageInfo,
        items,
      });
    },
  },
});

export const { addPlaylists } = PlaylistsSlice.actions;

export const playlist = (state: RootState) => state.playlist;

export default PlaylistsSlice.reducer;
