import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addSearch } from "../features/searchSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import SearchCard from "../components/search/SearchCard";
import { TokensType } from "../types/types";

const Search = () => {
  const [fetchMore, setFetchMore] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const searchStr = useAppSelector((state) => state.search.searchString);
  const refetch = useAppSelector((state) => state.search.refetch);
  const isOpen = useAppSelector((state) => state.hamburger);
  const searchData = useAppSelector((state) => state.search);

  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  useQuery({
    queryKey: ["search", fetchMore, refetch],
    queryFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${searchStr}&key=${
          import.meta.env.VITE_API_KEY
        }&pageToken=${fetchMore ? searchData?.nextPageToken : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Host: "www.googleapis.com",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      const search = await res.json();
      dispatch(addSearch(search));
      setFetchMore(false);
      return search;
    },
    enabled: !!fetchMore || !!refetch,
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className={`relative ml-4 mt-3 mr-2 mb-2 max-h-[90vh] ${
          !isOpen ? "w-[85vw]" : "w-full"
        }  overflow-y-auto hideScrollbar rounded-xl`}
      >
        <div className="w-2/3 mx-auto">
          {searchData?.items?.length <= 1 ? (
            <FidgetSpinner
              visible={true}
              height="80"
              width="80"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper mx-auto"
            />
          ) : (
            <Virtuoso
              className="!min-h-[90vh] !hideScrollbar"
              increaseViewportBy={200}
              data={searchData?.items}
              totalCount={searchData?.pageInfo?.totalResults}
              itemContent={(_, data) => (
                <SearchCard
                  key={
                    data?.id?.videoId ||
                    data?.id?.playlistId ||
                    data?.id?.channelId
                  }
                  search={data}
                />
              )}
              endReached={() => setTimeout(() => setFetchMore(true), 1000)}
              context={searchData}
              components={{
                Footer: ({ context: searchData }) => {
                  return searchData &&
                    searchData?.items?.length <
                      searchData?.pageInfo?.totalResults ? (
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="#3bf6fcbf"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass="justify-center"
                    />
                  ) : (
                    <div className="mx-auto text-lg italic font-bold w-max">
                      End
                    </div>
                  );
                },
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Search;
