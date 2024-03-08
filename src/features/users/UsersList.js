import React, { useState } from "react"
import { useGetUsersQuery } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import User from "./User"
import style from "./UsersList.module.css"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const UsersList = () => {
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetUsersQuery("usersList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    const navigate = useNavigate()
    const [role, setRole] = useState("Role")
    const [status, setStatus] = useState("status")
    const [searchText, setSearchText] = useState("")

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = users
        const filteredIds = ids?.length
            ? ids.filter((userId) => {
                  const user = entities[userId]
                  if (!user.username.match(searchText)) return false
                  if (status !== "status") {
                      if (user.active === false && status === "active")
                          return false
                      if (user.active === true && status === "inactive")
                          return false
                  }
                  if (role !== "Role") {
                      if (!user.roles.includes(role)) return false
                  }
                  return true
              })
            : null
        const listContent = filteredIds?.length
            ? filteredIds.map((userId) => <User key={userId} userId={userId} />)
            : null
        const handleCreateUser = () => navigate("/dash/users/new")
        content = (
            <>
                <div className={style.search_bar}>
                    <input
                        type="search"
                        placeholder="Search"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        name="roles"
                        id="roles"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Role">Role</option>
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <select
                        name="status"
                        id="status"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="status">Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button onClick={handleCreateUser}>
                        <FontAwesomeIcon
                            icon={faSquarePlus}
                            className={style.icon}
                        />
                    </button>
                </div>
                {listContent}
            </>
        )
    }
    return content
}

export default UsersList
