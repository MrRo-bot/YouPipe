import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { LikedVideosListType } from "../types/types";

const initialState: LikedVideosListType = {
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
        tags: [""],
        categoryId: "",
        liveBroadcastContent: "",
        defaultLanguage: "",
        localized: {
          title: "",
          description: "",
        },
        defaultAudioLanguage: "",
      },
      contentDetails: {
        duration: "",
        dimension: "",
        definition: "",
        caption: "",
        licensedContent: false,
        regionRestriction: {
          allowed: [""],
          blocked: [""],
        },
        contentRating: {
          acbRating: "",
          agcomRating: "",
          anatelRating: "",
          bbfcRating: "",
          bfvcRating: "",
          bmukkRating: "",
          catvRating: "",
          catvfrRating: "",
          cbfcRating: "",
          cccRating: "",
          cceRating: "",
          chfilmRating: "",
          chvrsRating: "",
          cicfRating: "",
          cnaRating: "",
          cncRating: "",
          csaRating: "",
          cscfRating: "",
          czfilmRating: "",
          djctqRating: "",
          djctqRatingReasons: [""],
          ecbmctRating: "",
          eefilmRating: "",
          egfilmRating: "",
          eirinRating: "",
          fcbmRating: "",
          fcoRating: "",
          fmocRating: "",
          fpbRating: "",
          fpbRatingReasons: [""],
          fskRating: "",
          grfilmRating: "",
          icaaRating: "",
          ifcoRating: "",
          ilfilmRating: "",
          incaaRating: "",
          kfcbRating: "",
          kijkwijzerRating: "",
          kmrbRating: "",
          lsfRating: "",
          mccaaRating: "",
          mccypRating: "",
          mcstRating: "",
          mdaRating: "",
          medietilsynetRating: "",
          mekuRating: "",
          mibacRating: "",
          mocRating: "",
          moctwRating: "",
          mpaaRating: "",
          mpaatRating: "",
          mtrcbRating: "",
          nbcRating: "",
          nbcplRating: "",
          nfrcRating: "",
          nfvcbRating: "",
          nkclvRating: "",
          oflcRating: "",
          pefilmRating: "",
          rcnofRating: "",
          resorteviolenciaRating: "",
          rtcRating: "",
          rteRating: "",
          russiaRating: "",
          skfilmRating: "",
          smaisRating: "",
          smsaRating: "",
          tvpgRating: "",
          ytRating: "",
        },
        projection: "",
        hasCustomThumbnail: false,
      },
      status: {
        uploadStatus: "",
        failureReason: "",
        rejectionReason: "",
        privacyStatus: "",
        publishAt: "",
        license: "",
        embeddable: false,
        publicStatsViewable: false,
        madeForKids: false,
        selfDeclaredMadeForKids: false,
        containsSyntheticMedia: false,
      },
      statistics: {
        viewCount: "",
        likeCount: "",
        dislikeCount: "",
        favoriteCount: "",
        commentCount: "",
      },
      player: {
        embedHtml: "",
        embedHeight: 0,
        embedWidth: 0,
      },
      topicDetails: {
        topicIds: [""],
        relevantTopicIds: [""],
        topicCategories: [""],
      },
      localizations: {
        key: {
          title: "",
          description: "",
        },
      },
    },
  ],
};

export const likedVideosSlice = createSlice({
  name: "likedVideos",
  initialState,
  reducers: {
    addLikedVideos: (state, action: PayloadAction<LikedVideosListType>) => {
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
  },
});

export const { addLikedVideos } = likedVideosSlice.actions;

export const likedVideos = (state: RootState) => state.likedVideos;

export default likedVideosSlice.reducer;
