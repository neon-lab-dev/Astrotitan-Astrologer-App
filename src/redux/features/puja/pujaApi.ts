import { baseApi } from "../../api/baseApi";


const pujaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPujas: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        category,
        intent,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        category?: string;
        intent?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (category) params.append("category", category);
        if (intent) params.append("intent", intent);

        return {
          url: `/puja?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["puja"],
    }),

    getSinglePujaById: builder.query({
      query: (id) => ({
        url: `/puja/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["puja"],
    }),

    // Review endpoints
    addPujaReview: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/puja/add-review/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["puja"],
    }),

    updatePujaReview: builder.mutation<any, any>({
      query: ({ pujaId, reviewId, data }) => ({
        url: `/puja/update-review/${pujaId}/${reviewId}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["puja"],
    }),

    deletePujaReview: builder.mutation<any, any>({
      query: ({ pujaId, reviewId }) => ({
        url: `/puja/delete-review/${pujaId}/${reviewId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["puja"],
    }),
    bookPuja: builder.mutation({
      query: ({ name, phoneNumber, pujaId, preferredDate, purposeOfPuja }) => ({
        url: "/puja-booking/book",

        method: "POST",

        body: {
          name,
          phoneNumber,
          pujaId,
          preferredDate,
          purposeOfPuja,
        },

        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllPujasQuery,
  useGetSinglePujaByIdQuery,
  useAddPujaReviewMutation,
  useUpdatePujaReviewMutation,
  useDeletePujaReviewMutation,
  useBookPujaMutation,
} = pujaApi;
