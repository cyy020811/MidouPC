import React from "react"
import { useParams } from "react-router-dom"
import EditProductForm from "./EditProductForm"
import { useGetProductsQuery } from "./productsApiSlice"

const EditProduct = () => {
    const { id } = useParams()
    const { product } = useGetProductsQuery("productsList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[id],
        }),
    })
    const content = product ? (
        <EditProductForm product={product} />
    ) : (
        <p>Loading...</p>
    )
    return content
}

export default EditProduct
