import { apiSlice } from './apiSlice';
const USERS_URL = '/api/products';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    getProducts: builder.query({
      query: () => ({
        url: `${USERS_URL}/products`,
        method: 'GET',
      }),
    }),
    getServices: builder.query({
      query: () => ({
        url: `${USERS_URL}/services`,
        method: 'GET',
      }),
    }),
    getProductsById: builder.query({
      query: ({ id }) => ({
        url: `${USERS_URL}/products/${id}`,
        method: 'GET',
      }),
    }),
    getServicesById: builder.query({
      query: ({ id }) => ({
        url: `${USERS_URL}/services/${id}`,
        method: 'GET',
      }),
    }),
    getServicesByCategory: builder.query({
      query: ({ search }) => ({
        url: `${USERS_URL}/category/${search}`,
        method: 'GET',
      }),
    }),
    getProductsByCategory: builder.query({
      query: ({ search }) => ({
        url: `${USERS_URL}/category/${search}`,
        method: 'GET',
      }),
    }),
    getProductsByTag: builder.query({
      query: ({ search }) => ({
        url: `${USERS_URL}/tag/${search}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetServicesQuery,
  useGetProductsByIdQuery,
  useGetServicesByIdQuery,
  useGetServicesByCategoryQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByTagQuery,
} = productApiSlice;