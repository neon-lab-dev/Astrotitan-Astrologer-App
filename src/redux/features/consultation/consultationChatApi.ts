import { baseApi } from "../../api/baseApi";

const consultationChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsultationMessages: builder.query({

      query: (consultationId) => ({
        url: `/consultation-chat/messages/${consultationId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["consultationChat"],
    }),

    markConsultationMessagesRead: builder.mutation({
      query: (consultationId) => ({
        url: `/consultation-chat/read/${consultationId}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["consultationChat"],
    }),
  }),
});

export const {
  useGetConsultationMessagesQuery,
  useMarkConsultationMessagesReadMutation,
} = consultationChatApi;
