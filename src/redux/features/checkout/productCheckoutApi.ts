import { baseApi } from "../../api/baseApi";


const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Review endpoints
    checkout: builder.mutation<any, any>({
      query: (data) => ({
        url: `/product-order/checkout`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["productCheckout"],
    }),
  }),
});

export const { useCheckoutMutation } = productsApi;
