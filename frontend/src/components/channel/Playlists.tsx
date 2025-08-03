import { useEffect, useState } from "react";
import { FidgetSpinner } from "react-loader-spinner";

import { useAppSelector } from "../../app/store";

import { usePersistedState } from "../../hooks/usePersistentStorage";

import customToastFunction from "../../utils/Toastify";

import PlaylistCard from "../playlist/PlaylistCard";

import { PlaylistItemListType, TokensType } from "../../types/types";

const Playlists = () => {
  const [playlist, setPlaylist] = useState<PlaylistItemListType[]>([]);

  const channelSections = useAppSelector((state) =>
    state.channelOverview.channelSections.items.filter(
      (channelSection) =>
        channelSection?.contentDetails &&
        channelSection?.contentDetails?.playlists
    )
  );

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  const parts = [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "status",
  ];

  const fetchFunc = async (id: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?id=${id}&part=${parts.join(
          ","
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error in fetching channels playlists");
      const playlist = await res.json();
      setPlaylist((prev) => [...prev, playlist]);
    } catch (error) {
      customToastFunction(
        `❌ ${error instanceof Error ? error.message : error}`,
        "error"
      );
    }
  };

  useEffect(() => {
    const getAllPlaylistSectionData = async () => {
      channelSections.map(async (x) => {
        if (x.contentDetails.playlists.length === 1) {
          fetchFunc(x.contentDetails.playlists[0]);
        } else {
          x.contentDetails.playlists.map((y: string) => {
            fetchFunc(y);
          });
        }
      });
    };

    getAllPlaylistSectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mb-2 mt-3 max-h-[90vh] min-h-[50vh] rounded-xl lg:mx-4 w-full overflow-y-auto hideScrollbar">
      {playlist?.length < 1 ? (
        <FidgetSpinner
          visible={true}
          height="80"
          width="80"
          ariaLabel="fidget-spinner-loading"
          wrapperStyle={{}}
          wrapperClass="fidget-spinner-wrapper mx-auto translate-y-1/2 -top-1/2"
        />
      ) : (
        <div className="grid grid-flow-row p-2 mt-5 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {playlist?.map(
            (playlist) =>
              playlist?.pageInfo?.totalResults !== 0 && (
                <PlaylistCard
                  key={playlist?.etag}
                  //@ts-expect-error its just PlaylistItemListType for PlaylistCard takes PlaylistType
                  playlist={playlist?.items[0]}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Playlists;
