import { apiSlice } from './apiSlice';
const USERS_URL = '/api/Tags';

export const tagApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTag: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateTag: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteTag: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    getTags: builder.query({
      query: () => ({
        url: `${USERS_URL}/`,
        method: 'GET',
      }),
    }),
    getTagsById: builder.query({
      query: ({ id }) => ({
        url: `${USERS_URL}/id/${id}`,
        method: 'GET',
      }),
    }),
    getTagsByName: builder.query({
      query: ({ name }) => ({
        url: `${USERS_URL}/name/${name}`,
        method: 'GET',
      }),
    }),
    getTagsByCategory: builder.query({
      query: ({ category }) => ({
        url: `${USERS_URL}/category/${category}`,
        method: 'GET',
      }),
    }),
}),
});

export const {
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetTagsQuery,
  useGetTagsByIdQuery,
  useGetTagsByNameQuery,
  useGetTagsByCategoryQuery,
} = tagApiSlice;