import React, { memo } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import style from "./Product.module.css"
import { useGetProductsQuery } from "./productsApiSlice"

const Product = ({ productId }) => {
    const { product } = useGetProductsQuery("productsList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[productId],
        }),
    })
    const navigate = useNavigate()

    if (product) {
        const handleEdit = () => navigate(`/dash/products/${productId}`)
        const stock_class = product.stock
            ? style.product_table_cell
            : style.product_table_cell_out_of_stock
        const content = (
            <tr>
                <td className={style.product_table_cell}>{product.name}</td>
                <td className={style.product_table_cell}>{product.brand}</td>
                <td className={style.product_table_cell}>{product.price}</td>
                <td className={stock_class}>{product.stock}</td>
                <td className={style.product_table_cell}>
                    <button
                        className={style.product_table_button}
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon
                            className={style.icon}
                            icon={faPenToSquare}
                        />
                    </button>
                </td>
            </tr>
        )
        return content
    } else return null
}

const memoizedProduct = memo(Product)

export default memoizedProduct
