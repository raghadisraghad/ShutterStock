import { apiSlice } from './apiSlice';
const USERS_URL = '/api/client';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
} = userApiSlice;