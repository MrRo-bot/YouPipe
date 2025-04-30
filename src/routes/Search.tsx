import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Virtuoso } from "react-virtuoso";

import { useAppDispatch, useAppSelector } from "../app/store";
import { SearchListType, TokensType } from "../types/types";
import { addSearch } from "../features/searchSlice";
import SearchCard from "../components/search/SearchCard";
import { usePersistedState } from "../hooks/usePersistentStorage";

//footer shows loading or end of list
const Footer = ({ context: searchData }: { context: SearchListType }) => {
  return searchData?.items?.length < searchData?.pageInfo?.totalResults ? (
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
    <div className="mx-auto text-lg italic font-bold w-max">End</div>
  );
};

const Search = () => {
  //search string
  const searchStr = useAppSelector((state) => state.search.searchString);

  const refetch = useAppSelector((state) => state.search.refetch);

  //sidebar
  const isOpen = useAppSelector((state) => state.hamburger);

  //fetch more data when scrolling down
  const [fetchMore, setFetchMore] = useState<boolean>(true);

  //dispatching redux reducers
  const dispatch = useAppDispatch();

  //getting search data from redux store
  const searchData = useAppSelector((state) => state.search);

  //access token from localStorage
  const [tokenData] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  //fetching search list using query string
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
            Authorization: `Bearer ${tokenData?.access_token}`,
          },
        }
      );
      const search = await res.json();
      dispatch(addSearch(search));
      setFetchMore(false);
      return search;
    },
    enabled: !!fetchMore || !!refetch,
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
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
              endReached={() => setTimeout(() => setFetchMore(true), 2000)}
              context={searchData}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              components={{ Footer }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Search;
