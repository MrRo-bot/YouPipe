import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { CategoriesType } from "../types/types";

const initialState: CategoriesType = {
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
        channelId: "",
        title: "",
        assignable: false,
      },
    },
  ],
};
export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    //adding categories in store
    addCategories: (state, action: PayloadAction<CategoriesType>) => {
      const { kind, etag, nextPageToken, prevPageToken, pageInfo, items } =
        action.payload;

      Object.assign(state, {
        kind,
        etag,
        nextPageToken,
        prevPageToken,
        pageInfo,
        items,
      });
    },
  },
});

export const { addCategories } = categoriesSlice.actions;

export const categories = (state: RootState) => state.categories;

export default categoriesSlice.reducer;
