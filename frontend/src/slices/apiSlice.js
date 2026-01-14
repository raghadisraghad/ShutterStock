import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include'
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Product', 'Video', 'Audio', 'Service', 'Tag', 'Category', 'Order'],
  endpoints: (builder) => ({}),
});