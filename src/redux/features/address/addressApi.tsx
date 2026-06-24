import { baseApi } from "../../api/baseApi";


export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addAddress: builder.mutation({
      query: (body) => ({
        url: "/address/add",
        method: "POST",
        body,
      }),

      invalidatesTags: ["address"],
    }),

    getMyAddresses: builder.query({
      query: () => ({
        url: "/address/my",
        method: "GET",
      }),

      providesTags: ["address"],
    }),

    updateAddress: builder.mutation({
      query: ({ id, body }) => ({
        url: `/address/update/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["address"],
    }),

    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/delete/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["address"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useAddAddressMutation,
  useGetMyAddressesQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;