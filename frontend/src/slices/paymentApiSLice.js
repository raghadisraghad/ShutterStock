import { apiSlice } from './apiSlice';
const URL = '/api/request-payment';

export const paymentApiSLice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    add: builder.mutation({
      query: (data) => ({
        url: `${URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    update: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${URL}/${id}`,
        method: 'PUT',
        body: { ...data },
      }),
    }),
    delete: builder.mutation({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    get: builder.query({
      query: () => ({
        url: `${URL}/`,
        method: 'GET',
      }),
    }),
    getById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: 'GET',
      }),
    }),
}),
});

export const {
  useAddMutation,
  useUpdateMutation,
  useDeleteMutation,
  useGetQuery,
  useGetByIdQuery,
} = paymentApiSLice;