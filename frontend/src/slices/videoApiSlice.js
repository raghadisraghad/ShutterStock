import { apiSlice } from './apiSlice';
const URL = 'api/videos';

const videoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addVideo: builder.mutation({
            query: ({ VideoData }) => ({
                url: `${URL}`,
                method: 'POST',
                body: { VideoData },
            }),
        }),
        updateVideo: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteVideo: builder.mutation({
            query: ({ id }) => ({
                url: `${URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        archiveVideo: builder.mutation({
            query: ({ id, status }) => ({
                url: `${URL}/archive/${id}`,
                method: 'PUT',
                body: status,
            }),
        }),
        getVideos: builder.query({
            query: () => ({
                url: `${URL}/`,
                method: 'GET',
            }),
        }),
        getVideosByVendor: builder.query({
            query: (vendorId) => ({
                url: `${URL}/vendor/${vendorId}`,
                method: 'GET',
            }),
        }),
        getVideoById: builder.query({
            query: ({ id }) => ({
                url: `${URL}/${id}`,
                method: 'GET',
            }),
        }),
        getVideosByCategory: builder.query({
            query: ({ search }) => ({
                url: `${URL}/category/${search}`,
                method: 'GET',
            }),
        }),
        getVideosByTag: builder.query({
            query: ({ search }) => ({
                url: `${URL}/tag/${search}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useAddVideoMutation,
    useArchiveVideoMutation,
    useDeleteVideoMutation,
    useUpdateVideoMutation,
    useGetVideoByIdQuery,
    useGetVideosByCategoryQuery,
    useGetVideosByTagQuery,
    useGetVideosByVendorQuery,
    useGetVideosQuery,
} = videoApiSlice;
