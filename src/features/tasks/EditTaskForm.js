import React, { useState, useEffect } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice"
import { useNavigate } from "react-router-dom"
import style from "./EditTaskForm.module.css"
import useAuth from "../../hooks/useAuth"

const EditTaskForm = ({ users, customers, task }) => {
    const [
        updateTask,
        {
            isLoading: isUpdateLoading,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateTaskMutation()
    const [
        deleteTask,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError,
        },
    ] = useDeleteTaskMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [user, setUser] = useState(task.user)
    const [customer, setCustomer] = useState(task.customer)
    const [completed, setCompleted] = useState(task.completed)

    useEffect(() => {
        if (isDeleteSuccess || isUpdateSuccess) {
            setTitle("")
            setDescription("")
            navigate("/dash/tasks")
        }
    }, [isDeleteSuccess, isUpdateSuccess, navigate])

    const { isManager, isAdmin } = useAuth()

    const onTitleChanged = (e) => setTitle(e.target.value)
    const onDescriptionChanged = (e) => setDescription(e.target.value)
    const onUserChanged = (e) => setUser(e.target.value)
    const onCustomerChanged = (e) => setCustomer(e.target.value)
    const onCompletedChanged = () => setCompleted((prev) => !prev)

    const canSave = [title, description, user, customer].every(Boolean)

    const onSaveTaskClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await updateTask({
                id: task.id,
                user,
                customer,
                title,
                description,
                completed,
            })
        }
    }
    const onDeleteTaskClicked = async (e) => {
        e.preventDefault()

        await deleteTask({ id: task.id })
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

    const saveButton = (
        <button
            title="Save"
            disabled={!canSave}
            onClick={onSaveTaskClicked}
            className={style.save_button}
        >
            Save
        </button>
    )
    const deleteButton =
        isManager || isAdmin ? (
            <button
                title="Delete"
                onClick={onDeleteTaskClicked}
                className={style.delete_button}
            >
                Delete
            </button>
        ) : null

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
                    <h2>Edit Task</h2>
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
                <label className={style.form_label} htmlFor="task-completed">
                    Completed:
                    <input
                        className={style.form_checkbox}
                        id="task-completed"
                        name="task-completed"
                        type="checkbox"
                        checked={completed}
                        onChange={onCompletedChanged}
                    />
                </label>
                <label className={style.form_label} htmlFor="user">
                    User:
                </label>
                <select
                    id="user"
                    name="user"
                    value={user}
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
                    value={customer}
                    className={validCustomerClass}
                    onChange={onCustomerChanged}
                >
                    {customerOptions}
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

export default EditTaskForm
