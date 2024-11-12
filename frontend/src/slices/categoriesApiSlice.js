import { apiSlice } from './apiSlice';
const USERS_URL = '/api/categories';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCategories: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCategories: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCategories: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    getCategories: builder.query({
      query: () => ({
        url: `${USERS_URL}/`,
        method: 'GET',
      }),
    }),
    getCategoriesById: builder.query({
      query: ({ id }) => ({
        url: `${USERS_URL}/id/${id}`,
        method: 'GET',
      }),
    }),
    getCategoriesByName: builder.query({
      query: ({ name }) => ({
        url: `${USERS_URL}/name/${name}`,
        method: 'GET',
      }),
    }),
}),
});

export const {
  useAddCategoriesMutation,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,
  useGetCategoriesQuery,
  useGetCategoriesByIdQuery,
  useGetCategoriesByNameQuery,
} = categoriesApiSlice;