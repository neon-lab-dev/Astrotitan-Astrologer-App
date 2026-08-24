import { baseApi } from "../../api/baseApi";

const kundliRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyKundliRequests: builder.query({
            query: ({
                keyword,
                page,
            }: {
                keyword?: string;
                page?: number;
            }) => {
                const params = new URLSearchParams();

                if (keyword) params.append("keyword", keyword);
                if (page) params.append("page", page.toString());

                return {
                    url: `/kundli-request/astrologer-requests${params.toString() ? `?${params.toString()}` : ""}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["kundliRequest"],
        }),

        getSingleKundliRequest: builder.query({
            query: (id) => ({
                url: `/kundli-request/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["kundliRequest"],
        }),

        submitKundliReport: builder.mutation({
            query: ({ id, data }) => ({
                url: `/kundli-request/${id}/submit-report`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["kundliRequest"],
        }),
    }),
});

export const {
    useGetMyKundliRequestsQuery,
    useGetSingleKundliRequestQuery,
    useSubmitKundliReportMutation,
} = kundliRequestApi;