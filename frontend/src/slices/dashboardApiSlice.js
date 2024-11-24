import { apiSlice } from './apiSlice';
const USERS_URL = '/api';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/clients/analysis`,
        method: 'GET',
      }),
    }),
    getProductsAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/products/product/analysis`,
        method: 'GET',
      }),
    }),
    getServicesAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/products/service/analysis`,
        method: 'GET',
      }),
    }),
    getOrdersAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/orders/orders/analysis`,
        method: 'GET',
      }),
    }),
}),
});

export const {
    useGetOrdersAnalysisQuery,
    useGetProductsAnalysisQuery,
    useGetServicesAnalysisQuery,
    useGetUsersAnalysisQuery,
} = dashboardApiSlice;