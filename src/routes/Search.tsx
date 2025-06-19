import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FidgetSpinner, ThreeDots } from "react-loader-spinner";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Virtuoso } from "react-virtuoso";

import { useAppDispatch, useAppSelector } from "../app/store";
import { addSearch, fetchMore } from "../features/searchSlice";
import { usePersistedState } from "../hooks/usePersistentStorage";
import SearchCard from "../components/search/SearchCard";
import { TokensType } from "../types/types";

const Search = () => {
  const dispatch = useAppDispatch();
  const searchStr = useAppSelector((state) => state.search.searchString);
  const location = useAppSelector((state) => state.location);
  const refetchMore = useAppSelector((state) => state.search.refetch);
  const fetchMoreSearchItems = useAppSelector(
    (state) => state.search.fetchMore
  );
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
    queryKey: ["search", refetchMore, fetchMoreSearchItems],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&regionCode=${location.address[
            "ISO3166-2-lvl4"
          ].slice(0, 2)}&q=${searchStr}&key=${
            import.meta.env.VITE_API_KEY
          }&pageToken=${fetchMoreSearchItems ? searchData?.nextPageToken : ""}
          `,
          {
            headers: {
              "Content-Type": "application/json",
              Host: "www.googleapis.com",
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error in fetching search results");
        const search = await res.json();
        dispatch(addSearch(search));
        dispatch(fetchMore(false));
        return search;
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
    enabled: !!refetchMore || !!fetchMoreSearchItems,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
          {searchData?.items?.length < 1 ? (
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
              endReached={() =>
                setTimeout(() => dispatch(fetchMore(true)), 1000)
              }
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
