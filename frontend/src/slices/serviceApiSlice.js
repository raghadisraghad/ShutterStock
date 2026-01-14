import { apiSlice } from './apiSlice';
const URL = '/api/services';

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (ServiceData) => ({
        url: `${URL}`,
        method: 'POST',
        body: ServiceData,
      }),
    }),
    updateService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `${URL}/${id}`,
        method: 'PUT',
        body: {serviceData},
      }),
    }),
    deleteService: builder.mutation({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    archiveService: builder.mutation({
      query: ({ id, status }) => ({
        url: `${URL}/archive/${id}`,
        method: 'PUT',
        body: status,
      }),
    }),
    getServices: builder.query({
      query: () => ({
        url: `${URL}/`,
        method: 'GET',
      }),
    }),
    getServicesByVendor: builder.query({
      query: (vendorId) => ({
        url: `${URL}/vendor/${vendorId}`,
        method: 'GET',
      }),
    }),
    getServiceById: builder.query({
      query: ({ id }) => ({
          url: `${URL}/${id}`,
          method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceByIdQuery,
  useGetServicesQuery,
  useGetServicesByVendorQuery,
  useArchiveServiceMutation,
} = serviceApiSlice;