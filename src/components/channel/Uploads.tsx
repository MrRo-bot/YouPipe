import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VirtuosoGrid } from "react-virtuoso";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";

import { useAppDispatch, useAppSelector } from "../../app/store";

import { addChannelUploads } from "../../features/channelOverviewSlice";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import { UploadCards } from "./UploadCards";

import { TokensType } from "../../types/types";

const Uploads = () => {
  const [fetchMore, setFetchMore] = useState(true);

  const dispatch = useAppDispatch();

  const channelDetails = useAppSelector(
    (state) => state.channelOverview.channelDetails
  );
  const channelUploads = useAppSelector(
    (state) => state.channelOverview.channelUploads
  );

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const channelUploadParts = ["contentDetails", "id", "snippet", "status"];

  useQuery({
    queryKey: [
      "channelUploads",
      channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads,
      fetchMore,
    ],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=${channelUploadParts.join(
          ","
        )}&maxResults=12&playlistId=${
          channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads
        }&key=${import.meta.env.VITE_API_KEY}&pageToken=${
          fetchMore ? channelUploads?.nextPageToken : ""
        }
        `,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const channelVideos = await res.json();
      dispatch(addChannelUploads(channelVideos));
      setFetchMore(false);
      return channelVideos;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled:
      !!channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads &&
      !!fetchMore,
  });

  return (
    <>
      {channelUploads?.items?.length <= 1 ? (
        <div className="w-full">
          <FidgetSpinner
            visible={true}
            height="80"
            width="80"
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper mx-auto"
          />
        </div>
      ) : (
        <VirtuosoGrid
          className="w-full min-h-[50vh] max-h-full !hideScrollbar"
          listClassName="grid grid-flow-row gap-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 "
          data={channelUploads?.items}
          totalCount={channelUploads?.pageInfo?.totalResults || 0}
          endReached={() => setTimeout(() => setFetchMore(true), 1000)}
          context={channelUploads}
          components={{
            Footer: ({ context: channelUploads }) => {
              const total = channelUploads?.pageInfo?.totalResults || 0;
              return channelUploads && channelUploads?.items?.length < total ? (
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="#3bf6fcbf"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass="justify-center py-1"
                />
              ) : (
                <div className="py-1 mx-auto text-lg italic font-bold w-max">
                  That's All
                </div>
              );
            },
          }}
          itemContent={(_, playlistItem) => (
            <UploadCards
              uniqueKey={playlistItem?.id}
              videoItem={playlistItem}
            />
          )}
        />
      )}
    </>
  );
};

export default Uploads;
