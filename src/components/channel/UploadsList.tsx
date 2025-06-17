import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SkeletonTheme } from "react-loading-skeleton";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { VirtuosoGrid } from "react-virtuoso";
import { useQuery } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "../../app/store";
import { addChannelUploads } from "../../features/channelOverviewSlice";
import { usePersistedState } from "../../hooks/usePersistentStorage";
import UploadsCard from "./UploadsCard";
import { TokensType } from "../../types/types";
import { Bounce, toast } from "react-toastify";

const UploadsList = () => {
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
      try {
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
        if (!res.ok) throw new Error("Error in fetching channel uploads");
        const channelVideos = await res.json();
        dispatch(addChannelUploads(channelVideos));
        setFetchMore(false);
        return channelVideos;
      } catch (error) {
        toast.error(`❌ ${error instanceof Error ? error.message : error}`, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!toastGradientError !font-bold !text-zinc-50",
          transition: Bounce,
        });
      }
    },
    refetchOnWindowFocus: false,
    enabled:
      !!channelDetails?.items[0]?.contentDetails?.relatedPlaylists?.uploads &&
      !!fetchMore,
  });

  return (
    <SkeletonTheme
      baseColor="rgba(255,255,255,0.1)"
      customHighlightBackground="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(242,0,41,0.2) 15%, rgba(255,2,245,0.3) 40%, rgba(0,26,249,0.3) 60%, rgba(255,149,0,0.2) 85%, rgba(255,255,255,0) 100%)"
    >
      <AnimatePresence>
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
            className="w-full min-h-[45vh] max-h-full !hideScrollbar"
            listClassName="grid grid-flow-row gap-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 "
            data={channelUploads?.items}
            totalCount={channelUploads?.pageInfo?.totalResults || 0}
            endReached={() => setTimeout(() => setFetchMore(true), 1000)}
            context={channelUploads}
            components={{
              Footer: ({ context: channelUploads }) => {
                const total = channelUploads?.pageInfo?.totalResults || 0;
                return channelUploads &&
                  channelUploads?.items?.length < total ? (
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
              <UploadsCard
                uniqueKey={playlistItem?.id}
                videoItem={playlistItem}
              />
            )}
          />
        )}
        {channelUploads?.pageInfo?.totalResults === 0 &&
          channelUploads?.items.length > 1 && (
            <div className="col-start-1 px-20 pt-5 pb-3 mx-auto text-center -col-end-1 w-max glass">
              <strong className="block text-3xl tracking-wider">
                <div
                  style={{ animationDelay: "0ms" }}
                  className="inline-block transition-all slideIn"
                >
                  N
                </div>
                <div
                  style={{ animationDelay: "50ms" }}
                  className="inline-block transition-all slideIn"
                >
                  o
                </div>
                <div className="inline-block">&nbsp;</div>

                <div
                  style={{ animationDelay: "150ms" }}
                  className="inline-block transition-all slideIn"
                >
                  V
                </div>
                <div
                  style={{ animationDelay: "200ms" }}
                  className="inline-block transition-all slideIn"
                >
                  i
                </div>
                <div
                  style={{ animationDelay: "300ms" }}
                  className="inline-block transition-all slideIn"
                >
                  d
                </div>
                <div
                  style={{ animationDelay: "350ms" }}
                  className="inline-block transition-all slideIn"
                >
                  e
                </div>
                <div
                  style={{ animationDelay: "450ms" }}
                  className="inline-block transition-all slideIn"
                >
                  o
                </div>
                <div
                  style={{ animationDelay: "500ms" }}
                  className="inline-block transition-all slideIn"
                >
                  s
                </div>
                <div className="inline-block">&nbsp;</div>
                <div
                  style={{ animationDelay: "550ms" }}
                  className="inline-block transition-all slideIn"
                >
                  F
                </div>
                <div
                  style={{ animationDelay: "650ms" }}
                  className="inline-block transition-all slideIn"
                >
                  o
                </div>
                <div
                  style={{ animationDelay: "700ms" }}
                  className="inline-block transition-all slideIn"
                >
                  u
                </div>
                <div
                  style={{ animationDelay: "750ms" }}
                  className="inline-block transition-all slideIn"
                >
                  n
                </div>
                <div
                  style={{ animationDelay: "800ms" }}
                  className="inline-block transition-all slideIn"
                >
                  d
                </div>
                <div
                  style={{ animationDelay: "1000ms" }}
                  className="inline-block transition-all slideIn"
                >
                  .
                </div>
              </strong>
            </div>
          )}
      </AnimatePresence>
    </SkeletonTheme>
  );
};

export default UploadsList;
