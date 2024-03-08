import React from "react"
import NewTaskForm from "./NewTaskForm"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetCustomersQuery } from "../customers/customersApiSlice"

const NewTask = () => {
    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    })

    const { customers } = useGetCustomersQuery("customersList", {
        selectFromResult: ({ data }) => ({
            customers: data?.ids.map((id) => data?.entities[id]),
        }),
    })

    const content =
        users?.length && customers?.length ? (
            <NewTaskForm users={users} customers={customers} />
        ) : (
            <p>Unavailable</p>
        )

    return content
}

export default NewTask
