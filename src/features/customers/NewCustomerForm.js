import React, { useState, useEffect } from "react"
import { useAddNewCustomerMutation } from "./customersApiSlice"
import { useNavigate } from "react-router-dom"
import style from "./NewCustomerForm.module.css"

const NAME_REGEX = /^[A-z]+/
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

const NewCustomerForm = () => {
    const [addNewCustomer, { isLoading, isSuccess, isError, error }] =
        useAddNewCustomerMutation()

    const navigate = useNavigate()

    const [firstname, setFirstname] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const [validFirstname, setValidFirstname] = useState(false)
    const [validSurname, setValidSurname] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [validPhone, setValidPhone] = useState(false)

    useEffect(() => {
        setValidFirstname(NAME_REGEX.test(firstname))
    }, [firstname])

    useEffect(() => {
        setValidSurname(NAME_REGEX.test(surname))
    }, [surname])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone))
    }, [phone])

    useEffect(() => {
        if (isSuccess) {
            setFirstname("")
            setSurname("")
            setEmail("")
            setPhone("")
            navigate("/dash/customers")
        }
    }, [isSuccess, navigate])

    const onFirstnameChanged = (e) => setFirstname(e.target.value)
    const onSurnameChanged = (e) => setSurname(e.target.value)
    const onEmailChanged = (e) => setEmail(e.target.value)
    const onPhoneChanged = (e) => setPhone(e.target.value)

    const canSave = [
        validFirstname,
        validSurname,
        validEmail,
        validPhone,
    ].every(Boolean)

    const onSaveCustomerClicked = async (e) => {
        e.preventDefault()
        console.log(canSave)
        if (canSave) {
            await addNewCustomer({ firstname, surname, email, phone })
            console.log("new customer created")
        }
    }

    const validFirstnameClass = !validFirstname
        ? style.input_incomplete
        : style.input_complete
    const validSurnameClass = !validSurname
        ? style.input_incomplete
        : style.input_complete
    const validEmailClass = !validEmail
        ? style.input_incomplete
        : style.input_complete
    const validPhoneClass = !validPhone
        ? style.input_incomplete
        : style.input_complete

    const content = (
        <div className={style.form_container}>
            <form className={style.form} onSubmit={onSaveCustomerClicked}>
                <div className={style.form__title_row}>
                    <h2>New Customer</h2>
                </div>
                <label className={style.form__label} htmlFor="firstnamename">
                    Firstname:{" "}
                </label>
                <input
                    className={validFirstnameClass}
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoComplete="off"
                    value={firstname}
                    onChange={onFirstnameChanged}
                />
                <label className={style.form__label} htmlFor="surname">
                    Surname:{" "}
                </label>
                <input
                    className={validSurnameClass}
                    id="surname"
                    name="surname"
                    type="text"
                    autoComplete="off"
                    value={surname}
                    onChange={onSurnameChanged}
                />
                <label className={style.form_label} htmlFor="email">
                    Email:{" "}
                </label>
                <input
                    className={validEmailClass}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />
                <label className={style.form_label} htmlFor="phone">
                    Phone:{" "}
                </label>
                <input
                    className={validPhoneClass}
                    id="phone"
                    name="phone"
                    type="phone"
                    value={phone}
                    onChange={onPhoneChanged}
                />
                <button
                    title="Save"
                    disabled={!canSave}
                    onClick={onSaveCustomerClicked}
                >
                    Save
                </button>
            </form>
        </div>
    )

    return content
}

export default NewCustomerForm
