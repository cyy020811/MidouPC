import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import style from "./Task.module.css"
import { useGetTasksQuery } from "./tasksApiSlice"

const Task = ({ taskId }) => {
    const { task } = useGetTasksQuery("tasksList", {
        selectFromResult: ({ data }) => ({
            task: data?.entities[taskId],
        }),
    })
    const navigate = useNavigate()

    if (task) {
        const date = new Date(task.createdAt)
        const handleEdit = () => navigate(`/dash/tasks/${taskId}`)
        const completed_class = task.completed ? style.completed : style.opened
        const status = task.completed ? "completed" : "opened"
        const content = (
            <div className={style.task_card}>
                <div className={style.task_details}>
                    <h2>#{task.order}</h2>
                    <div className={style.text}>
                        <h2>{task.title}</h2>
                        <h3>Created at: {date.toLocaleString()}</h3>
                    </div>
                </div>
                <div className={style.status_edit}>
                    <h1 className={completed_class}>{status}</h1>
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

const memoizedTask = memo(Task)

export default memoizedTask
