import { Link, useLocation } from "react-router-dom"
import style from "./DashHeader.module.css"
import image from "../img/demo.jpg"

const DashHeader = () => {
    const { pathname } = useLocation()
    const content = (
        <div className={style.wrapper}>
            <div className={style.title}>
                <span>Midou PC</span>
                <h2>Dashboard</h2>
            </div>
            <div className={style.user_info}>
                <Link to="/dash/profile">
                    <img src={image} alt="" />
                </Link>
            </div>
        </div>
    )

    return content
}
export default DashHeader
