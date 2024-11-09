import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  credentials: 'include'
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Product', 'Tag', 'Category', 'Order'],
  endpoints: (builder) => ({}),
});