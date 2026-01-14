import { apiSlice } from './apiSlice';
const URL = '/api/works';

export const workApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWork: builder.mutation({
      query: ({ WorkData }) => ({
        url: `${URL}`,
        method: 'POST',
        body: { WorkData },
      }),
    }),
    updateWork: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteWork: builder.mutation({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    archiveWork: builder.mutation({
      query: ({ id, status }) => ({
        url: `${URL}/archive/${id}`,
        method: 'PUT',
        body: status,
      }),
    }),
    getWorks: builder.query({
      query: () => ({
        url: `${URL}/`,
        method: 'GET',
      }),
    }),
    getWorksByVendor: builder.query({
      query: (vendorId) => ({
        url: `${URL}/vendor/${vendorId}`,
        method: 'GET',
      }),
    }),
    getWorkById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
  useGetWorkByIdQuery,
  useGetWorksQuery,
  useGetWorksByVendorQuery,
  useArchiveWorkMutation,
} = workApiSlice;