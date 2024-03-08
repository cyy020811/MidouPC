import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import style from "./EditProductForm.module.css"
import useAuth from "../../hooks/useAuth"

import {
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "./productsApiSlice"

const EditProductForm = ({ product }) => {
    const [
        updateProduct,
        {
            isLoading: isUpdateLoading,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateProductMutation()

    const [
        deleteProduct,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError,
        },
    ] = useDeleteProductMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(product.name)
    const [brand, setBrand] = useState(product.brand)
    const [stock, setStock] = useState(product.stock.toString())
    const [price, setPrice] = useState(product.price.toString())

    const [validStock, setValidStock] = useState(false)
    const [validPrice, setValidPrice] = useState(false)

    useEffect(() => {
        setValidStock(stock && !isNaN(stock))
    }, [stock])

    useEffect(() => {
        setValidPrice(price && !isNaN(price))
    }, [price])

    useEffect(() => {
        if (isDeleteSuccess || isUpdateSuccess) {
            setName("")
            setBrand("")
            navigate("/dash/products")
        }
    }, [isDeleteSuccess, isUpdateSuccess, navigate])

    useEffect(() => {
        if (isDeleteError) {
            console.log(deleteError?.data?.message)
        }
    }, [isDeleteError])

    const { isManager, isAdmin } = useAuth()

    const onNameChanged = (e) => setName(e.target.value)
    const onBrandChanged = (e) => setBrand(e.target.value)
    const onStockChanged = (e) => setStock(e.target.value)
    const onPriceChanged = (e) => setPrice(e.target.value)

    const canSave = [name, brand, validPrice, validStock].every(Boolean)

    const onSaveProductClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await updateProduct({ id: product.id, name, brand, stock, price })
        }
    }
    const onDeleteProductClicked = async (e) => {
        e.preventDefault()
        await deleteProduct({ id: product.id })
    }

    const validNameClass = !name ? style.input_incomplete : style.input_complete
    const validBrandClass = !brand
        ? style.input_incomplete
        : style.input_complete
    const validPriceClass = !validPrice
        ? style.input_incomplete
        : style.input_complete
    const validStockClass = !validStock
        ? style.input_incomplete
        : style.input_complete

    const saveButton = (
        <button
            title="Save"
            disabled={!canSave}
            onClick={onSaveProductClicked}
            className={style.save_button}
        >
            Save
        </button>
    )

    const deleteButton =
        isManager || isAdmin ? (
            <button
                title="Delete"
                onClick={onDeleteProductClicked}
                className={style.delete_button}
            >
                Delete
            </button>
        ) : null

    const content = (
        <div className={style.form_container}>
            <form className={style.form} onSubmit={onSaveProductClicked}>
                <div className={style.form__title_row}>
                    <h2>New Product</h2>
                </div>
                <label className={style.form__label} htmlFor="name">
                    Name:{" "}
                </label>
                <input
                    className={validNameClass}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={onNameChanged}
                />

                <label className={style.form_label} htmlFor="brand">
                    Brand:{" "}
                </label>
                <input
                    className={validBrandClass}
                    id="brand"
                    name="brand"
                    type="brand"
                    value={brand}
                    onChange={onBrandChanged}
                />

                <label className={style.form_label} htmlFor="stock">
                    Stock:{" "}
                </label>
                <input
                    className={validStockClass}
                    id="stock"
                    name="stock"
                    type="stock"
                    value={stock}
                    onChange={onStockChanged}
                />

                <label className={style.form_label} htmlFor="price">
                    Price:{" "}
                </label>
                <input
                    className={validPriceClass}
                    id="price"
                    name="price"
                    type="price"
                    value={price}
                    onChange={onPriceChanged}
                />
                <div className={style.buttons_container}>
                    {saveButton}
                    {deleteButton}
                </div>
            </form>
        </div>
    )

    return content
}

export default EditProductForm
