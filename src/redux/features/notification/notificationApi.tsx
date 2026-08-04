import { baseApi } from "../../api/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => ({
        url: `/notification/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["notification"],
    }),

    markAsRead: builder.mutation<any, any>({
      query: (id) => ({
        url: `/notification/read/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
} = notificationApi;