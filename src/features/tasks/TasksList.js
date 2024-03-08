import React, { useState } from "react"
import { useGetTasksQuery } from "./tasksApiSlice"
import Task from "./Task"
import style from "./TasksList.module.css"
import { useNavigate } from "react-router-dom"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useAuth from "../../hooks/useAuth"

const TasksList = () => {
    const {
        data: tasks,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetTasksQuery("tasksList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })
    const navigate = useNavigate()
    const [completed, setCompleted] = useState("status")
    const [searchText, setSearchText] = useState("")

    const { isAdmin, isManager, username } = useAuth()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = tasks

        const filteredIds = ids?.length
            ? ids.filter((taskId) => {
                  const task = entities[taskId]
                  console.log(task)
                  if (!isAdmin && !isManager) {
                      if (task.username !== username) return false
                  }

                  if (!task.title.match(searchText)) return false
                  if (completed !== "status") {
                      if (task.completed === false && completed === "completed")
                          return false
                      if (task.completed === true && completed === "opened")
                          return false
                  }
                  return true
              })
            : null

        const listContent = filteredIds?.length
            ? filteredIds.map((taskId) => <Task key={taskId} taskId={taskId} />)
            : null

        const handleCreateTask = () => navigate("/dash/tasks/new")
        content = (
            <>
                <div className={style.search_bar}>
                    <input
                        type="search"
                        placeholder="Search"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        name="status"
                        id="status"
                        onChange={(e) => setCompleted(e.target.value)}
                    >
                        <option value="status">Status</option>
                        <option value="completed">Completed</option>
                        <option value="opened">Opened</option>
                    </select>
                    <button onClick={handleCreateTask}>
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

export default TasksList
