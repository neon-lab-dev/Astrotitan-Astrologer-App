import { baseApi } from "../../api/baseApi";

const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyConsultationBookings: builder.query({
      query: ({
        limit,
        page,
        skip,
        status,
      }: {
        limit?: number;
        page?: number;
        skip?: number;
        status?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (status && status !== "All") {
          params.append("status", status);
        }
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());

        return {
          url: `/consultation/my-bookings?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["consultation"],
    }),

    getSingleConsultationBookings: builder.query({


      query: () => ({
        url: `/consultation/my-requests`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["consultation"],
    }),

    changeBookingStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/consultation/change-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
    endConsultationSession: builder.mutation({
      query: (id) => ({
        url:`/consultation/end-session/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
  }),
});

export const {
  useGetMyConsultationBookingsQuery,
  useGetSingleConsultationBookingsQuery,
  useChangeBookingStatusMutation,
  useEndConsultationSessionMutation,
} = consultationApi;
