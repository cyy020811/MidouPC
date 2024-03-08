import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import style from "./NewProductForm.module.css"
import { useAddNewProductMutation } from "./productsApiSlice"

const NewProductForm = () => {
    const [addNewProduct, { isLoading, isSuccess, isError, error }] =
        useAddNewProductMutation()

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [brand, setBrand] = useState("")
    const [stock, setStock] = useState("")
    const [price, setPrice] = useState("")

    const [validStock, setValidStock] = useState(false)
    const [validPrice, setValidPrice] = useState(false)

    useEffect(() => {
        setValidStock(stock && !isNaN(stock))
    }, [stock])

    useEffect(() => {
        setValidPrice(price && !isNaN(price))
    }, [price])

    useEffect(() => {
        if (isSuccess) {
            setName("")
            setBrand("")
            navigate("/dash/products")
        }
    }, [isSuccess, navigate])

    const onNameChanged = (e) => setName(e.target.value)
    const onBrandChanged = (e) => setBrand(e.target.value)
    const onStockChanged = (e) => setStock(e.target.value)
    const onPriceChanged = (e) => setPrice(e.target.value)

    const canSave = [name, brand, validPrice, validStock].every(Boolean)

    const onSaveProductClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewProduct({ name, brand, stock, price })
        }
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
                <button
                    title="Save"
                    disabled={!canSave}
                    onClick={onSaveProductClicked}
                >
                    Save
                </button>
            </form>
        </div>
    )

    return content
}

export default NewProductForm
