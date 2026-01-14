import { apiSlice } from './apiSlice';
const USERS_URL = '/api';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/client/analysis`,
        method: 'GET',
      }),
    }),
    getProductsAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/products/products/analysis`,
        method: 'GET',
      }),
    }),
    getProductsAnalysisAll: builder.query({
      query: () => ({
        url: `${USERS_URL}/products/products/all`,
        method: 'GET',
      }),
    }),
    getProductsAnalysisId: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/products/products/analysis/${id}`,
        method: 'GET',
      }),
    }),
    getOrdersAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/orders/orders/analysis`,
        method: 'GET',
      }),
    }),
    getServicesAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/services/services/analysis/`,
        method: 'GET',
      }),
    }),
    getAudiosAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/videos/videos/analysis/`,
        method: 'GET',
      }),
    }),
    getVideosAnalysis: builder.query({
      query: () => ({
        url: `${USERS_URL}/audios/audios/analysis/`,
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
    useGetAudiosAnalysisQuery,
    useGetVideosAnalysisQuery,
    useGetProductsAnalysisIdQuery,
    useGetProductsAnalysisAllQuery,
} = dashboardApiSlice;