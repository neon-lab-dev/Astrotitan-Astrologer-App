import { baseApi } from "../../api/baseApi";

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategoriesByAreaName: builder.query({
      query: (areaName) => ({
        url: `/category/${areaName}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["category"],
    }),

    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["category"],
    }),
  }),
});

export const { useGetAllCategoriesByAreaNameQuery, useGetSingleCategoryQuery } =
  categoriesApi;
