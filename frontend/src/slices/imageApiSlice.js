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
            query: (Path) => ({
                url: `${URL}/avatar/${Path}`,
                method: 'GET',
            }),
        }),
        uploadProductImage: builder.mutation({
            query: (imageList) => ({
                url: `${URL}/upload-product-image`,
                method: 'POST',
                body: imageList,
            }),
        }),
    }),
});

export const {
    useUploadAvatarMutation,
    useGetAvatarMutation,
    useUploadProductImageMutation,
} = imageApiSlice;
