import { apiSlice } from './apiSlice';
const USERS_URL = '/api/products';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (productData) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: productData,
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
    archiveImage: builder.mutation({
      query: ({ id, status }) => ({
        url: `${USERS_URL}/archive/${id}`,
        method: 'PUT',
        body: status,
      }),
    }),
    getProducts: builder.query({
      query: () => ({
        url: `${USERS_URL}/`,
        method: 'GET',
      }),
    }),
    getProductsByVendor: builder.query({
      query: (vendorId) => ({
        url: `${USERS_URL}/vendor/${vendorId}`,
        method: 'GET',
      }),
    }),
    getProductById: builder.query({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
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
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByTagQuery,
  useGetProductsByVendorQuery,
  useArchiveImageMutation,
} = productApiSlice;