import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
  createApi,
} from '@reduxjs/toolkit/query/react';

import { RootState } from '../store';
import { clearAuth, setAuth } from '../features/auth/authSlice';

const API_URL = 'https://astrotitan-server.onrender.com/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', token);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
      console.log("🚨 401 API:", args);
    try {
      const refreshResult = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await refreshResult.json();

      const accessToken = data?.data?.accessToken;

      if (accessToken) {
        const user = (api.getState() as RootState).auth.user;
        console.log('baseApi upated');
        api.dispatch(
          setAuth({
            user,
            token: accessToken,
          }),
        );

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    } catch (error) {
      console.log('Refresh token failed:', error);

      api.dispatch(clearAuth());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: baseQueryWithRefreshToken,

  tagTypes: [
    'users',
    'astrologers',
    'notification',
    'blogs',
    'queries',
    'address',
    'product',
    'puja',
    'category',
    'productCheckout',
    'orders',
  ],

  endpoints: () => ({}),
});
