import { apiSlice } from './apiSlice';
const URL = 'api/Audios';

const audioApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAudio: builder.mutation({
            query: ({AudioData}) => ({
                url: `${URL}`,
                method: 'POST',
                body: {AudioData},
            }),
        }),
        updateAudio: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteAudio: builder.mutation({
            query: ({ id }) => ({
                url: `${URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        archiveAudio: builder.mutation({
            query: ({ id, status }) => ({
                url: `${URL}/archive/${id}`,
                method: 'PUT',
                body: status,
            }),
        }),
        getAudios: builder.query({
            query: () => ({
                url: `${URL}/`,
                method: 'GET',
            }),
        }),
        getAudiosByVendor: builder.query({
            query: (vendorId) => ({
                url: `${URL}/vendor/${vendorId}`,
                method: 'GET',
            }),
        }),
        getAudioById: builder.query({
            query: ({ id }) => ({
                url: `${URL}/${id}`,
                method: 'GET',
            }),
        }),
        getAudiosByCategory: builder.query({
            query: ({ search }) => ({
                url: `${URL}/category/${search}`,
                method: 'GET',
            }),
        }),
        getAudiosByTag: builder.query({
            query: ({ search }) => ({
                url: `${URL}/tag/${search}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useAddAudioMutation,
    useArchiveAudioMutation,
    useDeleteAudioMutation,
    useGetAudioByIdQuery,
    useGetAudiosByCategoryQuery,
    useGetAudiosByTagQuery,
    useGetAudiosByVendorQuery,
    useGetAudiosQuery,
} = audioApiSlice;
