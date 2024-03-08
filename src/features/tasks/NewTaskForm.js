import React, { useState, useEffect } from "react"
import { useAddNewTaskMutation } from "./tasksApiSlice"
import { useNavigate } from "react-router-dom"
import style from "./NewTaskForm.module.css"

const NewTaskForm = ({ users, customers }) => {
    const [addNewTask, { isLoading, isSuccess, isError, error }] =
        useAddNewTaskMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [user, setUser] = useState("")
    const [customer, setCustomer] = useState("")

    useEffect(() => {
        if (isSuccess) {
            setTitle("")
            setDescription("")
            navigate("/dash/tasks")
        }
    }, [isSuccess, navigate])

    const onTitleChanged = (e) => setTitle(e.target.value)
    const onDescriptionChanged = (e) => setDescription(e.target.value)
    const onUserChanged = (e) => setUser(e.target.value)
    const onCustomerChanged = (e) => setCustomer(e.target.value)

    const canSave = [title, description, user, customer].every(Boolean)

    const onSaveTaskClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewTask({ user, customer, title, description })
        }
    }

    const userOptions = (
        <>
            <option key="user" value={""}>
                Please select an user
            </option>
            {users.map((user) => {
                return (
                    <option key={user.id} value={user.id}>
                        {user.username}
                    </option>
                )
            })}
        </>
    )

    const customerOptions = (
        <>
            <option key="customer" value={""}>
                Please select a customer
            </option>
            {customers.map((customer) => {
                return (
                    <option key={customer.id} value={customer.id}>
                        {customer.firstname.concat(" ", customer.surname)}
                    </option>
                )
            })}
        </>
    )

    const validTitleClass = !title
        ? style.input_incomplete
        : style.input_complete
    const validDescriptionClass = !description
        ? style.input_incomplete
        : style.input_complete
    const validUserClass = !user ? style.input_incomplete : style.input_complete
    const validCustomerClass = !customer
        ? style.input_incomplete
        : style.input_complete

    const content = (
        <div className={style.form_container}>
            <form className={style.form} onSubmit={onSaveTaskClicked}>
                <div className={style.form__title_row}>
                    <h2>New Task</h2>
                </div>
                <label className={style.form__label} htmlFor="title">
                    Title:{" "}
                </label>
                <input
                    className={validTitleClass}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className={style.form_label} htmlFor="description">
                    Description:{" "}
                </label>
                <textarea
                    className={validDescriptionClass}
                    id="description"
                    name="description"
                    type="description"
                    value={description}
                    onChange={onDescriptionChanged}
                    rows={5}
                />

                <label className={style.form_label} htmlFor="user">
                    User:
                </label>
                <select
                    id="user"
                    name="user"
                    className={validUserClass}
                    onChange={onUserChanged}
                >
                    {userOptions}
                </select>
                <label className={style.form_label} htmlFor="customer">
                    Customer:
                </label>
                <select
                    id="customer"
                    name="customer"
                    className={validCustomerClass}
                    onChange={onCustomerChanged}
                >
                    {customerOptions}
                </select>
                <button
                    title="Save"
                    disabled={!canSave}
                    onClick={onSaveTaskClicked}
                >
                    Save
                </button>
            </form>
        </div>
    )

    return content
}

export default NewTaskForm
