import { baseApi } from "../../api/baseApi";


export const queryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =======================================================
     * RAISE QUERY
     * ======================================================= */

    raiseQuery: builder.mutation({
      query: ({ subject, issueType, description, attachments = [] }) => {
        const formData = new FormData();

        formData.append("subject", subject);

        formData.append("issueType", issueType);

        formData.append("description", description);

        attachments.forEach((file: any, index: number) => {
          formData.append("attachments", {
            uri: file.uri,

            name: file.name || `attachment-${index}.jpg`,

            type: file.mimeType || file.type || "image/jpeg",
          } as any);
        });

        return {
          url: "/query/raise",

          method: "POST",

          body: formData,

          formData: true,
        };
      },

      invalidatesTags: ["queries"],
    }),

    /* =======================================================
     * GET MY QUERIES
     * ======================================================= */

    getMyQueries: builder.query({
      query: ({
        status = [],

        limit = 10,

        page = 1,
      }) => {
        const params = new URLSearchParams();

        if (Array.isArray(status)) {
          status.forEach((item) => {
            if (item) {
              params.append("status", item);
            }
          });
        }

        params.append("limit", String(limit));

        params.append("page", String(page));

        return {
          url: `/query/my-queries?${params.toString()}`,

          method: "GET",
        };
      },

      serializeQueryArgs: ({ endpointName }) => endpointName,

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }

        currentCache.data.data = [
          ...(currentCache?.data?.data || []),

          ...(newItems?.data?.data || []),
        ];

        currentCache.data.meta = newItems.data.meta;
      },

      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },

      providesTags: ["queries"],
    }),

    /* =======================================================
     * GET SINGLE QUERY
     * ======================================================= */

    getSingleQuery: builder.query({
      query: (id) => ({
        url: `/query/my-queries/${id}`,

        method: "GET",
      }),

      providesTags: ["queries"],
    }),

    /* =======================================================
     * DELETE QUERY
     * ======================================================= */

    deleteQuery: builder.mutation({
      query: (id) => ({
        url: `/query/my-queries/delete/${id}`,

        method: "DELETE",
      }),

      invalidatesTags: ["queries"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useRaiseQueryMutation,

  useGetMyQueriesQuery,

  useGetSingleQueryQuery,

  useDeleteQueryMutation,
} = queryApi;
