import { baseApi } from "../../api/baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBlogs: builder.query<any, any>({
      query: () => {
        return {
          url: `/blog/my-blogs`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["blogs"],
    }),

    getBlogById: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/blog/${id}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["blogs"],
    }),

    addBlog: builder.mutation<any, any>({
      query: (data) => ({
        url: `/blog/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetMyBlogsQuery,
  useGetBlogByIdQuery,
  useAddBlogMutation,
  useLazyGetMyBlogsQuery,
} = blogApi;
