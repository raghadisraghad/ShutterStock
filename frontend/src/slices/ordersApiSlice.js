import { apiSlice } from './apiSlice';
const USERS_URL = '/api/orders';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addOrders: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateOrders: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteOrders: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    archiveProduct: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/archive/${id}`,
        method: 'PUT',
      }),
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${USERS_URL}/`,
        method: 'GET',
      }),
    }),
    getOrdersById: builder.query({
      query: ({ id }) => ({
        url: `${USERS_URL}/id/${id}`,
        method: 'GET',
      }),
    }),
    getOrdersByClient: builder.query({
      query: (clientId) => ({
        url: `${USERS_URL}/client/${clientId}`,
        method: 'GET',
      }),
    }),
    getOrdersByVendor: builder.query({
      query: ( id ) => ({
        url: `${USERS_URL}/vendor/${id}`,
        method: 'GET',
      }),
    }),
}),
});

export const {
  useAddOrdersMutation,
  useUpdateOrdersMutation,
  useDeleteOrdersMutation,
  useGetOrdersQuery,
  useGetOrdersByIdQuery,
  useGetOrdersByClientQuery,
  useGetOrdersByVendorQuery,
  useArchiveProductMutation,
} = ordersApiSlice;