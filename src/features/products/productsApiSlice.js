import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const productsAdapter = createEntityAdapter({})

const initialState = productsAdapter.getInitialState()

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: "/products",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData) => {
                const loadedProducts = responseData.map((product) => {
                    product.id = product._id
                    return product
                })
                return productsAdapter.setAll(initialState, loadedProducts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Product", id: "LIST" },
                        ...result.ids.map((id) => ({
                            type: "Product",
                            id,
                        })),
                    ]
                } else return [{ type: "Product", id: "LIST" }]
            },
        }),
        addNewProduct: builder.mutation({
            query: (initialProductData) => ({
                url: "/products",
                method: "POST",
                body: {
                    ...initialProductData,
                },
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),
        updateProduct: builder.mutation({
            query: (initialProductData) => ({
                url: "/products",
                method: "PATCH",
                body: {
                    ...initialProductData,
                },
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: "Product", id: arg.id }]
            },
        }),
        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: "/products",
                method: "DELETE",
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: "Product", id: arg.id }]
            },
        }),
    }),
})

export const {
    useGetProductsQuery,
    useUpdateProductMutation,
    useAddNewProductMutation,
    useDeleteProductMutation,
} = productsApiSlice

export const selectProductsResult =
    productsApiSlice.endpoints.getProducts.select()

const selectProductsData = createSelector(
    selectProductsResult,
    (productsResult) => productsResult.data
)

export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds,
} = productsAdapter.getSelectors(
    (state) => selectProductsData(state) ?? initialState
)
