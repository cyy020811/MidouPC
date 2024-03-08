import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const customersAdapter = createEntityAdapter({})

const initialState = customersAdapter.getInitialState()

export const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: () => ({
                url: "/customers",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData) => {
                const loadedCustomers = responseData.map((customer) => {
                    customer.id = customer._id
                    return customer
                })
                return customersAdapter.setAll(initialState, loadedCustomers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Customer", id: "LIST" },
                        ...result.ids.map((id) => ({
                            type: "Customer",
                            id,
                        })),
                    ]
                } else return [{ type: "Customer", id: "LIST" }]
            },
        }),
        addNewCustomer: builder.mutation({
            query: (initialCustomerData) => ({
                url: "/customers",
                method: "POST",
                body: {
                    ...initialCustomerData,
                },
            }),
            invalidatesTags: [{ type: "Customer", id: "LIST" }],
        }),
        updateCustomer: builder.mutation({
            query: (initialCustomerData) => ({
                url: "/customers",
                method: "PATCH",
                body: {
                    ...initialCustomerData,
                },
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: "Customer", id: arg.id }]
            },
        }),
        deleteCustomer: builder.mutation({
            query: ({ id }) => ({
                url: "/customers",
                method: "DELETE",
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: "Customer", id: arg.id }]
            },
        }),
    }),
})

export const {
    useGetCustomersQuery,
    useAddNewCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customersApiSlice

export const selectCustomersResult =
    customersApiSlice.endpoints.getCustomers.select()

const selectCustomersData = createSelector(
    selectCustomersResult,
    (customersResult) => customersResult.data
)

export const {
    selectAll: selectAllCustomers,
    selectById: selectCustomerById,
    selectIds: selectCustomerIds,
} = customersAdapter.getSelectors(
    (state) => selectCustomersData(state) ?? initialState
)
