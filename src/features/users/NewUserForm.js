import React, { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from "././../../config/roles"
import style from "./NewUserForm.module.css"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    const [addNewUser, { isLoading, isSuccess, isError, error }] =
        useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [roles, setRoles] = useState(["Employee"])
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername("")
            setPassword("")
            setRoles([])
            navigate("/dash/users")
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean)

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, roles })
        }
    }

    const options = Object.values(ROLES).map((role) => {
        return (
            <option key={role} value={role}>
                {role}
            </option>
        )
    })

    const validUserClass = !validUsername
        ? style.input_incomplete
        : style.input_complete
    const validPasswordClass = !validPassword
        ? style.input_incomplete
        : style.input_complete
    const validRolesClass = !Boolean(roles.length)
        ? style.input_incomplete
        : style.input_complete

    const content = (
        <div className={style.form_container}>
            <form className={style.form} onSubmit={onSaveUserClicked}>
                <div className={style.form__title_row}>
                    <h2>New User</h2>
                </div>
                <label className={style.form__label} htmlFor="username">
                    Username:{" "}
                    <span className={style.nowrap}>[3-20 letters]</span>
                </label>
                <input
                    className={validUserClass}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className={style.form_label} htmlFor="password">
                    Password:{" "}
                    <span className={style.nowrap}>
                        [4-12 chars incl. !@#$%]
                    </span>
                </label>
                <input
                    className={validPasswordClass}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className={style.form_label} htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={validRolesClass}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
                <button
                    title="Save"
                    disabled={!canSave}
                    onClick={onSaveUserClicked}
                >
                    Save
                </button>
            </form>
        </div>
    )

    return content
}

export default NewUserForm
