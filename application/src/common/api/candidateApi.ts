import { createApi } from '@reduxjs/toolkit/query/react';

import { FilterQueryParams, PaginatedResult, PaginationQueryParams, SearchTextParams } from 'common/models';
import { Candidate } from 'common/models/candidate';
import { SortingQueryParams } from 'common/models/sorting';
import { customBaseQuery } from './customBaseQuery';
import { QueryParamsBuilder } from './queryParamsBuilder';

export interface CandidateFormData {
    id?: number,
    name: string;
    email: string;
    department: number;
  };

export type CreateCandidateRequest = Pick<
    CandidateFormData,
    'name' | 'email' | 'department'
>;

export type UpdateCandidateRequest = Pick<
    CandidateFormData,
    'id' | 'name' | 'email' | 'department'
>;

export const candidateApi = createApi({
    reducerPath: 'candidateApi',

    baseQuery: customBaseQuery,

    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,

    tagTypes: ['Candidate'],

    endpoints: builder => ({
        getCandidates: builder.query<
            PaginatedResult<Candidate>,
            PaginationQueryParams & SortingQueryParams & FilterQueryParams & SearchTextParams
            >({
                query: ({ page = 1, pageSize = 10, sortBy, filters, searchText }) => {
                    const queryParams = new QueryParamsBuilder()
                        .setSearchParam(searchText)
                        .setPaginationParams(page, pageSize)
                        .setSortParam(sortBy)
                        .setFilterParam(filters)
                        .build();
                    return { url: `/candidates/?${queryParams}` };
                },
                providesTags: ['Candidate'],
            }),
        getCandidateById: builder.query<Candidate, number | string>({
            query: id => ({ url: `/candidates/${id}/` }),
            providesTags: ['Candidate']
        }),
        createCandidate: builder.mutation<Candidate, CreateCandidateRequest>({
            query: payload => ({
                url: '/candidates/',
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Candidate']
        }),
        updateCandidate: builder.mutation<Candidate, UpdateCandidateRequest>({
            query: ({ id, ...candidateUpdate }) => ({
                url: `/candidates/${id}/update/`,
                method: 'PUT',
                body: candidateUpdate
            }),
            invalidatesTags: ['Candidate']
        }),
        deleteCandidate: builder.mutation<void, number>({
            query: candidateId => ({
                url: `/candidates/${candidateId}/delete/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Candidate']
        }),
        getDepartments: builder.query({
            query: () => ({ url: `/candidates/dept`}),
            providesTags: ['Candidate']
        })
    })
});

export const {
    useGetCandidatesQuery,
    useGetCandidateByIdQuery,
    useCreateCandidateMutation,
    useUpdateCandidateMutation,
    useDeleteCandidateMutation,
    useGetDepartmentsQuery,
} = candidateApi;