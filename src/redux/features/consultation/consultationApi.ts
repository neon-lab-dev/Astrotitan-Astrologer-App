import { baseApi } from "../../api/baseApi";

const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyConsultationBookings: builder.query({
      query: ({
        limit,
        page,
        skip,
        date,
        status,
        method,
      }: {
        limit?: number;
        page?: number;
        skip?: number;
        date?: string;
        status?: string;
        method?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (date) params.append("date", date);
        if (status && status !== "All") {
          params.append("status", status);
        }
        if (method && method !== "all") {
          params.append("method", method);
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

    getSingleConsultationBookingById: builder.query({
      query: (id) => ({
        url: `/consultation/${id}`,
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
        url: `/consultation/end-session/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    scheduleMeeting: builder.mutation({
      query: (id) => ({
        url: `/consultation/schedule-meeting/${id}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    provideNotes: builder.mutation({
      query: ({ id, data }) => ({
        url: `/consultation/add-recommendations/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
  }),
});

export const {
  useGetMyConsultationBookingsQuery,
  useGetSingleConsultationBookingsQuery,
  useGetSingleConsultationBookingByIdQuery,
  useChangeBookingStatusMutation,
  useEndConsultationSessionMutation,
  useScheduleMeetingMutation,
  useProvideNotesMutation,
} = consultationApi;
