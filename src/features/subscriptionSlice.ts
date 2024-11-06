import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { SubscriptionListType } from "../types/types";

const initialState: SubscriptionListType = {
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
        channelTitle: "",
        title: "",
        description: "",
        resourceId: {
          kind: "",
          channelId: "",
        },
        channelId: "",
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
        },
      },
      contentDetails: {
        totalItemCount: 0,
        newItemCount: 0,
        activityType: "",
      },
      subscriberSnippet: {
        title: "",
        description: "",
        channelId: "",
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
        },
      },
    },
  ],
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    addSubscription: (state, action: PayloadAction<SubscriptionListType>) => {
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

export const { addSubscription } = subscriptionSlice.actions;

export const subscription = (state: RootState) => state.subscription;

export default subscriptionSlice.reducer;
