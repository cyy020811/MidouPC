import { useNavigate } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import style from "./Login.module.css"

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [persist, setPersist] = usePersist()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        setErrMsg("")
    }, [username, password])

    if (isLoading) return <p>Loading...</p>

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            localStorage.setItem("username", username)
            setUsername("")
            setPassword("")
            navigate("/dash")
        } catch (err) {
            if (!err.status) {
                setErrMsg("No Server Response")
            } else if (err.status === 400) {
                setErrMsg("Missing Username or Password")
            } else if (err.status === 401) {
                setErrMsg("Unauthorized")
            } else {
                setErrMsg(err.data?.message)
            }
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = (e) => setPersist((prev) => !prev)

    const content = (
        <div className={style.full_window}>
            <div className={style.container}>
                <div className={style.form_container}>
                    <p ref={errRef} aria-live="assertive">
                        {errMsg}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <h1>Employee Login</h1>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            value={username}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={handlePwdInput}
                            value={password}
                            required
                        />
                        <button>Sign In</button>
                        <label htmlFor="persist" className={style.toggle}>
                            <span>Trust This Device</span>
                            <input
                                type="checkbox"
                                id="persist"
                                onChange={handleToggle}
                                checked={persist}
                            />
                        </label>
                    </form>
                </div>
            </div>
        </div>
    )

    return content
}

export default Login
