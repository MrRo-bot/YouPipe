import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { CommentListType } from "../types/types";

const initialState: CommentListType = {
  kind: "",
  etag: "",
  nextPageToken: "",
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
        channelId: "",
        videoId: "",
        topLevelComment: [],
        canReply: false,
        totalReplyCount: 0,
        isPublic: false,
      },
      replies: {
        comments: [],
      },
    },
  ],
};

export const commentsThreadSlice = createSlice({
  name: "commentsThread",
  initialState,
  reducers: {
    //adding liked videos list in redux store
    addCommentsThread: (state, action: PayloadAction<CommentListType>) => {
      const { kind, etag, nextPageToken, pageInfo, items } = action.payload;

      Object.assign(state, {
        kind,
        etag,
        nextPageToken,
        pageInfo,
        items: [
          ...(state?.kind === "" ? state.items.slice(1) : state.items),
          ...items,
        ],
      });
    },
    clearCommentsThread: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { addCommentsThread, clearCommentsThread } =
  commentsThreadSlice.actions;

export const commentsThread = (state: RootState) => state.commentsThread;

export default commentsThreadSlice.reducer;
