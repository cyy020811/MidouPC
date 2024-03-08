import React, { useState, useEffect } from "react"
import {
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} from "./customersApiSlice"
import { useNavigate } from "react-router-dom"
import style from "./EditCustomerForm.module.css"
import { MEMBERSHIPS } from "../../config/memberships"
import useAuth from "../../hooks/useAuth"

const NAME_REGEX = /^[A-z]+/
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

const EditCustomerForm = ({ customer }) => {
    const [
        updateCustomer,
        {
            isLoading: isUpdateLoading,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateCustomerMutation()
    const [
        deleteCustomer,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError,
        },
    ] = useDeleteCustomerMutation()

    const navigate = useNavigate()

    const [firstname, setFirstname] = useState(customer.firstname)
    const [surname, setSurname] = useState(customer.surname)
    const [email, setEmail] = useState(customer.email)
    const [phone, setPhone] = useState(customer.phone)
    const [membership, setMembership] = useState(customer.membership)

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
        if (isDeleteSuccess || isUpdateSuccess) {
            setFirstname("")
            setSurname("")
            setEmail("")
            setPhone("")
            navigate("/dash/customers")
        }
    }, [isDeleteSuccess, isUpdateSuccess, navigate])

    useEffect(() => {
        if (isDeleteError || isUpdateError) {
            alert(deleteError?.data?.message || updateError?.data?.message)
        }
    }, [isDeleteError, isUpdateError, navigate])

    const { isManager, isAdmin } = useAuth()

    const onFirstnameChanged = (e) => setFirstname(e.target.value)
    const onSurnameChanged = (e) => setSurname(e.target.value)
    const onEmailChanged = (e) => setEmail(e.target.value)
    const onPhoneChanged = (e) => setPhone(e.target.value)
    const onMembershipChanged = (e) => setMembership(e.target.value)

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
            await updateCustomer({
                id: customer.id,
                firstname,
                surname,
                email,
                phone,
                membership,
            })
            console.log("new customer created")
        }
    }

    const onDeleteCustomerClicked = async (e) => {
        e.preventDefault()
        await deleteCustomer({ id: customer.id })
    }

    const options = Object.values(MEMBERSHIPS).map((membership) => {
        return (
            <option key={membership} value={membership}>
                {membership}
            </option>
        )
    })

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

    const saveButton = (
        <button
            title="Save"
            disabled={!canSave}
            onClick={onSaveCustomerClicked}
            className={style.save_button}
        >
            Save
        </button>
    )
    const deleteButton =
        isManager || isAdmin ? (
            <button
                title="Delete"
                onClick={onDeleteCustomerClicked}
                className={style.delete_button}
            >
                Delete
            </button>
        ) : null
    const content = (
        <div className={style.form_container}>
            <form className={style.form} onSubmit={onSaveCustomerClicked}>
                <div className={style.form__title_row}>
                    <h2>Edit Customer</h2>
                </div>
                <label className={style.form__label} htmlFor="firstname">
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
                <label className={style.form_label} htmlFor="membership">
                    Membership:{" "}
                </label>
                <select
                    id="membership"
                    name="membership"
                    className={style.input_complete}
                    size="3"
                    value={membership}
                    onChange={onMembershipChanged}
                >
                    {options}
                </select>
                <div className={style.buttons_container}>
                    {saveButton}
                    {deleteButton}
                </div>
            </form>
        </div>
    )

    return content
}

export default EditCustomerForm
