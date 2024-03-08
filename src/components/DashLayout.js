import React from "react"
import { Outlet } from "react-router-dom"
import DashSidebar from "./DashSidebar"
import DashHeader from "./DashHeader"
import style from "./DashLayout.module.css"

const DashLayout = () => {
    const content = (
        <>
            <DashSidebar />
            {/* {Sidebar} */}
            {/* {Header} */}
            <div className={style.content}>
                <DashHeader />
                <Outlet />
            </div>
        </>
    )
    return content
}

export default DashLayout
