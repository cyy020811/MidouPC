import React, { useState } from "react"
import { useGetProductsQuery } from "./productsApiSlice"
import Product from "./Product"
import style from "./ProductsList.module.css"
import { useNavigate } from "react-router-dom"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProductsList = () => {
    const {
        data: products,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetProductsQuery("productsList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    const navigate = useNavigate()
    const [searchText, setSearchText] = useState("")
    const [stock, setStock] = useState("stock")

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = products

        const filteredIds = ids?.length
            ? ids.filter((productId) => {
                  const product = entities[productId]
                  if (
                      !product.name.match(searchText) &&
                      !product.brand.match(searchText)
                  ) {
                      return false
                  }
                  if (stock !== "status") {
                      if (product.stock === 0 && stock === "in_stock")
                          return false
                      if (product.stock > 0 && stock === "out_of_stock")
                          return false
                  }
                  return true
              })
            : null

        const tableContent = filteredIds?.length
            ? filteredIds.map((productId) => (
                  <Product key={productId} productId={productId} />
              ))
            : null

        const handleCreateProduct = () => navigate("/dash/products/new")
        content = (
            <>
                <div className={style.search_bar}>
                    <input
                        type="search"
                        placeholder="Search"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        name="status"
                        id="status"
                        onChange={(e) => setStock(e.target.value)}
                    >
                        <option value="status">Status</option>
                        <option value="in_stock">In stock</option>
                        <option value="out_of_stock">Out of stock</option>
                    </select>
                    <button onClick={handleCreateProduct}>
                        <FontAwesomeIcon
                            icon={faSquarePlus}
                            className={style.icon}
                        />
                    </button>
                </div>
                <div className={style.table_container}>
                    <h3>Product Table</h3>
                    <table className={style.product_table}>
                        <thead className={style.table_thead}>
                            <tr>
                                <th
                                    scope="col"
                                    className={style.product_table_th}
                                >
                                    Item
                                </th>
                                <th
                                    scope="col"
                                    className={style.product_table_th}
                                >
                                    Brand
                                </th>
                                <th
                                    scope="col"
                                    className={style.product_table_th}
                                >
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    className={style.product_table_th}
                                >
                                    Stock
                                </th>
                                <th
                                    scope="col"
                                    className={style.product_table_th}
                                >
                                    Edit
                                </th>
                            </tr>
                        </thead>
                        <tbody>{tableContent}</tbody>
                    </table>
                </div>
            </>
        )
    }
    return content
}

export default ProductsList
