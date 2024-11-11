import { apiSlice } from './apiSlice';
const URL = 'api/pictures';

const imageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadAvatar: builder.mutation({
            query: (formData) => ({
                url: `${URL}/upload-avatar`,
                method: 'POST',
                body: formData,
            }),
        }),
        getAvatar: builder.mutation({
            query: (Path, FileName) => ({
                url: `${URL}/avatar/${Path}/${FileName}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useUploadAvatarMutation,
    useGetAvatarMutation,
} = imageApiSlice;
