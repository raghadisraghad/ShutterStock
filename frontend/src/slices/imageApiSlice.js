import { apiSlice } from './apiSlice';
const URL = 'api/pictures';

const imageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadAvatar: builder.mutation({
            query: ({id, formData}) => ({
                url: `${URL}/upload-avatar/${id}`,
                method: 'POST',
                body: formData,
            }),
        }),
        uploadService: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${URL}/upload-service-image/${id}`,
                method: 'POST',
                body: formData,
            }),
        }),
        uploadWork: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${URL}/upload-service-work-image/${id}`,
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
            query: ({ id, formData }) => ({
                url: `${URL}/upload-product-image/${id}`,
                method: 'POST',
                body: formData,
            }),
        }),
        uploadProductVideo: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${URL}/upload-product-video/${id}`,
                method: 'POST',
                body: formData,
            }),
        }),
        uploadProductAudio: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${URL}/upload-product-audio/${id}`,
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useUploadAvatarMutation,
    useGetAvatarMutation,
    useUploadProductImageMutation,
    useUploadProductVideoMutation,
    useUploadProductAudioMutation,
    useUploadServiceMutation,
    useUploadWorkMutation,
} = imageApiSlice;
