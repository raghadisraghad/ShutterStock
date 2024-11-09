import { apiSlice } from './apiSlice';
const USERS_URL = '/api/client';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
} = userApiSlice;