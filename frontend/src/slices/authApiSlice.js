import { apiSlice } from './apiSlice';
import { setCredentials } from './authSlice'
const URL = 'api/auth';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${URL}/login`,
        method: 'POST',
        body: data,
      }),
      async onQuerySuccess(response, { dispatch }) {
        const user = response?.user;
        const token = response?.token;
        if (token) {
          dispatch(setCredentials({ user, token }));
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${URL}/logout`,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${URL}/register`,
        method: 'POST',
        body: data,
      }),
      onQuerySuccess(response) {
        console.log(response);
      },
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/api/upload-avatar',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUploadAvatarMutation,
} = authApiSlice;
