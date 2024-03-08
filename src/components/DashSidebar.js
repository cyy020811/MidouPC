import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faHouse,
    faListCheck,
    faBoxesStacked,
    faAddressBook,
    faGear,
    faUsers,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import style from "./DashSidebar.module.css"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"

const DashSideBar = () => {
    const navigate = useNavigate()

    const [sendLogout, { isLoading, isSuccess, isError, error }] =
        useSendLogoutMutation()

    const onGoHomeClicked = () => navigate("/dash")
    const onGoTasksClicked = () => navigate("/dash/tasks")
    const onGoInventoryClicked = () => navigate("/dash/products")
    const onGoCustomersClicked = () => navigate("/dash/customers")
    const onGoProfileClicked = () => navigate("/dash/profile")
    const onGoStaffClicked = () => navigate("/dash/users")
    const onLogoutClicked = () => {
        sendLogout()
        navigate("/")
    }

    const { isManager, isAdmin } = useAuth()

    if (isLoading) return <p>Loading...</p>

    if (isError) return <p>Error: {error.data?.message}</p>

    const content = (
        <>
            <div className={style.sidebar}>
                <div className={style.logo}></div>
                <ul className={style.menu}>
                    <li>
                        <button onClick={onGoHomeClicked}>
                            <FontAwesomeIcon
                                className={style.icon}
                                icon={faHouse}
                            />
                            <span>Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={onGoTasksClicked}>
                            <FontAwesomeIcon
                                className={style.icon}
                                icon={faListCheck}
                            />
                            <span>Tasks</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={onGoInventoryClicked}>
                            <FontAwesomeIcon
                                className={style.icon}
                                icon={faBoxesStacked}
                            />
                            <span>Inventory</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={onGoCustomersClicked}>
                            <FontAwesomeIcon
                                className={style.icon}
                                icon={faAddressBook}
                            />
                            <span>Customers</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={onGoProfileClicked}>
                            <FontAwesomeIcon
                                className={style.icon}
                                icon={faGear}
                            />
                            <span>Profile</span>
                        </button>
                    </li>
                    {(isManager || isAdmin) && (
                        <li>
                            <button onClick={onGoStaffClicked}>
                                <FontAwesomeIcon
                                    className={style.icon}
                                    icon={faUsers}
                                />
                                <span>Staff</span>
                            </button>
                        </li>
                    )}
                    <li className={style.logout}>
                        <button onClick={onLogoutClicked}>
                            <FontAwesomeIcon
                                className={style.icon}
                                icon={faRightFromBracket}
                            />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
    return content
}

export default DashSideBar
