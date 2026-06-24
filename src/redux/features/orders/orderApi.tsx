import { baseApi } from "../../api/baseApi";

export const orderApi =
  baseApi.injectEndpoints({
    endpoints: (
      builder
    ) => ({
      /* ---------------- GET MY ORDERS ---------------- */

      getMyOrders:
        builder.query({
          query: (
            params = {}
          ) => {
            const cleanedParams =
              Object.fromEntries(
                Object.entries(
                  {
                    keyword: params?.keyword,
                    status: params?.status,
                    skip: params?.skip ?? 0,
                    limit: params?.limit ?? 10,
                  }
                ).filter(
                  ([
                    _,
                    value,
                  ]) => value !== undefined && value !== null && value !== ""
                )
              );

            return {
              url: `/product-order/my-orders`,
              method:
                "GET",
              params:
                cleanedParams,
            };
          },


          serializeQueryArgs:
            ({
              endpointName,
              queryArgs,
            }) => {
              return JSON.stringify(
                {
                  endpointName,
                  keyword: queryArgs?.keyword,
                  status: queryArgs?.status,
                }
              );
            },

          merge: (
            currentCache,
            newItems,
            { arg }
          ) => {
            const incomingOrders =
              newItems?.data
                ?.orders ||
              [];
            if (arg?.skip === 0) {
              currentCache.data =
                newItems.data;
              return;
            }

            /* UNIQUE MERGE */

            const existingIds =
              new Set(
                (
                  currentCache?.data?.orders || []
                ).map(
                  (item: any) => item._id
                )
              );

            const filtered =
              incomingOrders.filter(
                (item: any) => !existingIds.has(item._id)
              );

            currentCache.data =
            {
              ...newItems.data,
              orders: [
                ...(currentCache?.data?.orders || []),
                ...filtered,
              ],
            };
          },

          forceRefetch({
            currentArg,
            previousArg,
          }) {
            return (
              JSON.stringify(currentArg) !== JSON.stringify(previousArg)
            );
          },

          providesTags: [
            "orders",
          ],
        }),


      getOrderById:
        builder.query({
          query: (id) => ({
            url: `/product-order/my-orders/${id}`,
            method:
              "GET",
          }),

          providesTags: (result,error,id
          ) => [
              {type: "orders",id,},
            ],
        }),
    }),
  });

export const {
  useGetMyOrdersQuery,
  useLazyGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;