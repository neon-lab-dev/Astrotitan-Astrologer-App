import { baseApi } from "../../api/baseApi";


const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        category, intent
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        category?: string;
        intent?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (category) params.append("category", category);
        if (intent) params.append("intent", intent);
        return {
          url: `/product?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["product"],
    }),

    getSingleProductById: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["product"],
    }),

    // Review endpoints
    addProductReview: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/product/add-review/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),

    // Review endpoints
    checkout: builder.mutation<any, any>({
      query: (data) => ({
        url: `/product-order/checkout`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),

    updateProductReview: builder.mutation<any, any>({
      query: ({ productId, reviewId, data }) => ({
        url: `/product/update-review/${productId}/${reviewId}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),

    deleteProductReview: builder.mutation<any, any>({
      query: ({ productId, reviewId }) => ({
        url: `/product/delete-review/${productId}/${reviewId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductByIdQuery,
  useAddProductReviewMutation,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
  useCheckoutMutation
} = productsApi;
