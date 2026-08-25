import { baseApi } from "../../api/baseApi";

export const astrologerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAstrologers: builder.query({
      query: (params) => ({
        url: `/astrologer`,
        method: "GET",
        params: {
          keyword: params.keyword || "",
          isIdentityVerified: params.isIdentityVerified || "",
          country: params.country || "",
          gender: params.gender || "",
          skip: params.skip || 0,
          limit: params.limit || 10,
          areaOfPractice: params.areaOfPractice || "",
          consultLanguages: params.consultLanguages || "",
        },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.data = [...(currentCache.data || []), ...newItems.data];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.skip !== previousArg?.skip;
      },
      providesTags: ["astrologers"],
    }),
    getAstrologerById: builder.query({
      query: (id) => `/astrologer/${id}`,
    }),

    updateAvailability: builder.mutation<any, any>({
      query: (data) => ({
        url: `/astrologer/availability/update`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["astrologers"],
    }),

    getStats: builder.query({
      query: () => ({
        url: `/astrologer/stats/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["astrologers"],
    }),
  }),
});

export const { useGetAstrologersQuery, useGetAstrologerByIdQuery, useUpdateAvailabilityMutation, useGetStatsQuery } =
  astrologerApi;
