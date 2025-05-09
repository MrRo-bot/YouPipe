import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  ChannelInfoType,
  ChannelSectionType,
  PlaylistItemListType,
} from "../types/types";

const initialState = {
  channelSections: {
    kind: "",
    etag: "",
    items: [
      {
        kind: "",
        etag: "",
        id: "",
        snippet: {
          type: "",
          channelId: "",
          title: "",
          position: 0,
        },
        contentDetails: {
          playlists: [],
          channels: [],
        },
      },
    ],
  },
  channelDetails: {
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
          title: "",
          description: "",
          customUrl: "",
          publishedAt: "",
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
          defaultLanguage: "",
          localized: {
            title: "",
            description: "",
          },
          country: "",
        },
        contentDetails: {
          relatedPlaylists: {
            likes: "",
            favorites: "",
            uploads: "",
          },
        },
        statistics: {
          viewCount: "",
          subscriberCount: "",
          hiddenSubscriberCount: false,
          videoCount: "",
        },
        topicDetails: {
          topicIds: [],
          topicCategories: [],
        },
        status: {
          privacyStatus: "",
          isLinked: false,
          longUploadsStatus: "",
          madeForKids: false,
          selfDeclaredMadeForKids: false,
        },
        brandingSettings: {
          channel: {
            title: "",
            description: "",
            keywords: "",
            trackingAnalyticsAccountId: "",
            unsubscribedTrailer: "",
            defaultLanguage: "",
            country: "",
          },
          watch: {
            textColor: "",
            backgroundColor: "",
            featuredPlaylistId: "",
          },
          image: {
            bannerExternalUrl: "",
          },
        },
        auditDetails: {
          overallGoodStanding: false,
          communityGuidelinesGoodStanding: false,
          copyrightStrikesGoodStanding: false,
          contentIdClaimsGoodStanding: false,
        },
        contentOwnerDetails: {
          contentOwner: "",
          timeLinked: "",
        },
        localizations: {
          key: {
            title: "",
            description: "",
          },
        },
      },
    ],
  },
  channelUploads: {
    kind: "",
    etag: "",
    nextPageToken: "",
    prevPageToken: "",
    pageInfo: {
      totalResults: null,
      resultsPerPage: null,
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
        contentDetails: {
          videoId: "",
          startAt: "",
          endAt: "",
          note: "",
          videoPublishedAt: 0,
        },
        status: {
          privacyStatus: "",
        },
      },
    ],
  },
};

export const ChannelOverview = createSlice({
  name: "channeloverview",
  initialState,
  reducers: {
    addChannelDetails: (state, action: PayloadAction<ChannelInfoType>) => {
      Object.assign(state.channelDetails, action.payload);
    },

    addChannelSections: (state, action: PayloadAction<ChannelSectionType>) => {
      Object.assign(state.channelSections, action.payload);
    },

    addChannelUploads: (state, action: PayloadAction<PlaylistItemListType>) => {
      const { kind, etag, nextPageToken, prevPageToken, pageInfo, items } =
        action.payload;
      Object.assign(state.channelUploads, {
        kind,
        etag,
        nextPageToken,
        prevPageToken,
        pageInfo,
        items: [
          ...(state?.channelUploads?.kind === ""
            ? state.channelUploads.items.slice(1)
            : state.channelUploads.items),
          ...items,
        ],
      });
    },

    clearChannel: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  addChannelDetails,
  addChannelUploads,
  addChannelSections,
  clearChannel,
} = ChannelOverview.actions;

export const channelOverview = (state: RootState) => state.channelOverview;

export default ChannelOverview.reducer;
