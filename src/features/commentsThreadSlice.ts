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

    updateComment: (state, action) => {
      const { commentId, text } = action.payload;
      Object.assign(state, {
        ...state,
        items: state.items.map((c) =>
          c.id === commentId
            ? {
                ...c,
                snippet: {
                  ...c.snippet,
                  topLevelComment: {
                    ...c?.snippet?.topLevelComment,
                    snippet: {
                      ...c?.snippet?.topLevelComment?.snippet,
                      textOriginal: text,
                      textDisplay: text,
                      updatedAt: new Date().toISOString(),
                    },
                  },
                },
              }
            : c
        ),
      });
    },

    updateReply: (state, action) => {
      const { replyId, text } = action.payload;
      Object.assign(state, {
        ...state,
        items: state.items.map((c) =>
          c.replies
            ? {
                ...c,
                replies: {
                  comments: c.replies.comments.map((r) =>
                    r.id === replyId
                      ? {
                          ...r,
                          snippet: {
                            ...r.snippet,
                            textOriginal: text,
                            textDisplay: text,
                            updatedAt: new Date().toISOString(),
                          },
                        }
                      : r
                  ),
                },
              }
            : c
        ),
      });
    },

    deleteComment: (state, action) => {
      Object.assign(state, {
        ...state,
        items: state.items.filter((comment) => comment.id !== action.payload),
      });
    },

    deleteReply: (state, action) => {
      Object.assign(state, {
        ...state,
        items: state.items.map((comment) =>
          comment.replies
            ? {
                ...comment,
                replies: {
                  comments: comment.replies.comments.filter(
                    (reply) => !reply.id.includes(action.payload)
                  ),
                },
              }
            : comment
        ),
      });
    },
  },
});

export const {
  addCommentsThread,
  clearCommentsThread,
  addComment,
  addReply,
  updateComment,
  updateReply,
  deleteComment,
  deleteReply,
} = commentsThreadSlice.actions;

export const commentsThread = (state: RootState) => state.commentsThread;

export default commentsThreadSlice.reducer;
