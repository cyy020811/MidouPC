import React, { useState, useEffect } from "react"
import { useUpdateUserMutation } from "../users/usersApiSlice"
import style from "./Profile.module.css"
import { useNavigate } from "react-router-dom"
import { useGetUsersQuery } from "../users/usersApiSlice"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const Profile = () => {
    const [editPassword, setEditPassword] = useState(false)
    const [editUsername, setEditUsername] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [newUsername, setNewUsername] = useState("")
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const navigate = useNavigate()

    const [updateUser, { isSuccess, isLoading, isError, error }] =
        useUpdateUserMutation()

    useEffect(() => {
        setValidUsername(USER_REGEX.test(newUsername))
    }, [newUsername])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(newPassword))
    }, [newPassword])

    useEffect(() => {
        if (isSuccess) {
            console.log("success")
            if (newUsername) localStorage.setItem("username", newUsername)
            navigate("/dash")
        }
    }, [isSuccess, navigate, newUsername])

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    })

    const name = localStorage.getItem("username")
    const user = users.find((user) => {
        return user.username === name
    })

    if (!user) return <p>User not found</p>

    if (isLoading) return <p>Loading...</p>

    if (isError) return <p>{error?.data?.message}</p>

    const onUsernameChanged = (e) => setNewUsername(e.target.value)

    const onPasswordChanged = (e) => setNewPassword(e.target.value)

    const onEditUsernameClicked = () => {
        setEditUsername(true)
    }

    const onCancelEditUsernameClicked = () => {
        setEditUsername(false)
        setNewUsername("")
    }

    const onEditPasswordClicked = () => {
        setEditPassword(true)
    }

    const onCancelEditPasswordClicked = () => {
        setEditPassword(false)
        setNewPassword("")
    }

    const onSaveUsernameClicked = async () => {
        if (validUsername && editUsername) {
            await updateUser({
                id: user.id,
                username: newUsername,
                roles: user.roles,
                active: user.active,
            })
        }
    }

    const onSavePasswordClicked = async () => {
        if (validPassword && editPassword) {
            await updateUser({
                id: user.id,
                username: name,
                password: newPassword,
                roles: user.roles,
                active: user.active,
            })
        }
    }

    const saveUsernameButtonText = editUsername ? "Save" : "Edit"
    const saveUsernameCancelButton = editUsername ? (
        <button
            className={style.cancel_button}
            onClick={onCancelEditUsernameClicked}
        >
            Cancel
        </button>
    ) : null
    const usernameButtonFunction = editUsername
        ? onSaveUsernameClicked
        : onEditUsernameClicked
    const usernameInputClass = !editUsername
        ? style.hide
        : !validUsername
        ? style.input_incomplete
        : style.input_complete

    const savePasswordButtonText = editPassword ? "Save" : "Edit"
    const savePasswordCancelButton = editPassword ? (
        <button
            className={style.cancel_button}
            onClick={onCancelEditPasswordClicked}
        >
            Cancel
        </button>
    ) : null
    const passwordButtonFunction = editPassword
        ? onSavePasswordClicked
        : onEditPasswordClicked
    const passwordInputClass = !editPassword
        ? style.hide
        : !validPassword
        ? style.input_incomplete
        : style.input_complete

    return (
        <div className={style.container}>
            <div className={style.info_container}>
                <h2>Username: {user.username}</h2>
                <input
                    onChange={onUsernameChanged}
                    className={usernameInputClass}
                />
                <button
                    className={style.save_button}
                    onClick={usernameButtonFunction}
                >
                    {saveUsernameButtonText}
                </button>
                {saveUsernameCancelButton}
            </div>
            <div className={style.info_container}>
                <h2>Edit password: </h2>
                <input
                    onChange={onPasswordChanged}
                    className={passwordInputClass}
                />
                <button
                    className={style.save_button}
                    onClick={passwordButtonFunction}
                >
                    {savePasswordButtonText}
                </button>
                {savePasswordCancelButton}
            </div>
        </div>
    )
}

export default Profile
