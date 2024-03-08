import React from "react"
import { useParams } from "react-router-dom"
import EditTaskForm from "./EditTaskForm"
import { useGetTasksQuery } from "./tasksApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetCustomersQuery } from "../customers/customersApiSlice"
import useAuth from "../../hooks/useAuth"

const EditTask = () => {
    const { id } = useParams()
    const { username, isManager, isAdmin } = useAuth()

    const { task } = useGetTasksQuery("tasksList", {
        selectFromResult: ({ data }) => ({
            task: data?.entities[id],
        }),
    })

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

    if (!isManager && !isAdmin) {
        if (task.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content =
        task && users && customers ? (
            <EditTaskForm users={users} customers={customers} task={task} />
        ) : (
            <p>Loading...</p>
        )

    return content
}

export default EditTask
