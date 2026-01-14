import { apiSlice } from './apiSlice';
const URL = '/api/payment';

export const stripeApiSlice = apiSlice.injectEndpoints({
endpoints: (builder) => ({
    addPayment: builder.mutation({
      query: ({products}) => ({
        url: `${URL}/`,
        method: 'POST',
        body: {products},
      }),
    }),
}),
});

export const {
  useAddPaymentMutation,
} = stripeApiSlice;