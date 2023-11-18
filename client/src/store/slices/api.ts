import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const googleApi: any = createApi({
  reducerPath: 'google',
  baseQuery: fetchBaseQuery({ baseUrl: `/api/user` }),
  endpoints: (builder) => ({
    getGoogleLink: builder.query({
      query: () => `/google-auth`,
    }),
  }),
});

export const { useGetGoogleLinkQuery } = googleApi;
