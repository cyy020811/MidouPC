import { store } from "../../app/store"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { usersApiSlice } from "../users/usersApiSlice"
import { customersApiSlice } from "../customers/customersApiSlice"
import { tasksApiSlice } from "../tasks/tasksApiSlice"
import { productsApiSlice } from "../products/productsApiSlice"

const Prefetch = () => {
    useEffect(() => {
        store.dispatch(
            usersApiSlice.util.prefetch("getUsers", "usersList", {
                force: true,
            })
        )
        store.dispatch(
            customersApiSlice.util.prefetch("getCustomers", "customersList", {
                force: true,
            })
        )
        store.dispatch(
            tasksApiSlice.util.prefetch("getTasks", "tasksList", {
                force: true,
            })
        )
        store.dispatch(
            productsApiSlice.util.prefetch("getProducts", "productsList", {
                force: true,
            })
        )
    }, [])

    return <Outlet />
}

export default Prefetch
