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
        topLevelComment: {
          kind: "",
          etag: "",
          id: "",
          snippet: {
            channelId: "",
            videoId: "",
            parentId: "",
            textDisplay: "",
            textOriginal: "",
            authorDisplayName: "",
            authorProfileImageUrl: "",
            authorChannelUrl: "",
            authorChannelId: {
              value: "",
            },
            canRate: false,
            viewerRating: "",
            likeCount: 0,
            publishedAt: "",
            updatedAt: "",
          },
        },
        canReply: false,
        totalReplyCount: 0,
        isPublic: false,
      },
      replies: {
        comments: [
          {
            kind: "",
            etag: "",
            id: "",
            snippet: {
              channelId: "",
              videoId: "",
              textDisplay: "",
              textOriginal: "",
              parentId: "",
              authorDisplayName: "",
              authorProfileImageUrl: "",
              authorChannelUrl: "",
              authorChannelId: {
                value: "",
              },
              canRate: false,
              viewerRating: "",
              likeCount: 0,
              publishedAt: "",
              updatedAt: "",
            },
          },
        ],
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

    addComment: (state, action) => {
      Object.assign(state, state.items.unshift(action.payload));
    },

    addReply: (state, action) => {
      const index = action.payload.id.split(".")[0];

      const isReply = Object.prototype.hasOwnProperty.call(
        state.items[state.items.findIndex((comment) => comment.id === index)],
        "replies"
      );

      Object.assign(
        state,
        isReply
          ? state.items[
              state.items.findIndex((comment) => comment.id === index)
            ]?.replies?.comments.push(action.payload)
          : (state.items[
              state.items.findIndex((comment) => comment.id === index)
            ]["replies"] = { comments: [action.payload] })
      );
    },

    clearCommentsThread: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { addCommentsThread, clearCommentsThread, addComment, addReply } =
  commentsThreadSlice.actions;

export const commentsThread = (state: RootState) => state.commentsThread;

export default commentsThreadSlice.reducer;
