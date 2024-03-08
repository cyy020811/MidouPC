import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import image from "../../img/demo.jpg"
import style from "./User.module.css"
import { useGetUsersQuery } from "./usersApiSlice"

const User = ({ userId }) => {
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId],
        }),
    })
    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)
        const userRolesString = user.roles.toString().replaceAll(",", ", ")
        const active_class = user.active ? style.active : style.inactive
        const status = user.active ? "Active" : "Inactive"
        const content = (
            <div className={style.user_card}>
                <div className={style.user_details}>
                    <img src={image} alt="" />
                    <div className={style.text}>
                        <h2>{user.username}</h2>
                        <span>{userRolesString}</span>
                    </div>
                </div>
                <div className={style.status_edit}>
                    <h1 className={active_class}>{status}</h1>
                    <button onClick={handleEdit}>
                        <FontAwesomeIcon
                            className={style.icon}
                            icon={faPenToSquare}
                        />
                    </button>
                </div>
            </div>
        )
        return content
    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser
