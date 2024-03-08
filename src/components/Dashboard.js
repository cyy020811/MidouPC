import { useGetTasksQuery } from "../features/tasks/tasksApiSlice"
import useAuth from "../hooks/useAuth"
import style from "./Dashboard.module.css"
import {
    faFire,
    faClipboardList,
    faCheck,
    faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const day = 1000 * 60 * 60 * 24
const fortnight = 14

const Dashboard = () => {
    const { isAdmin, isManager, username } = useAuth()

    const { tasks } = useGetTasksQuery("tasksList", {
        selectFromResult: ({ data }) => ({
            tasks: data?.ids.map((id) => data?.entities[id]),
        }),
    })

    let completedCount = 0
    let monthlyCompletedCount = 0
    let incompleteCount = 0
    let urgentCount = 0

    if (tasks) {
        const today = new Date(Date.now())
        tasks.forEach((task) => {
            if (task.username === username) {
                const createdDate = new Date(task.createdAt)
                if (task.completed) {
                    completedCount += 1
                    if (
                        today.getFullYear() === createdDate.getFullYear() &&
                        today.getMonth() === createdDate.getMonth()
                    )
                        monthlyCompletedCount += 1
                } else {
                    incompleteCount += 1
                    const timeDiff = today.getTime() - createdDate
                    if (Math.round(timeDiff / day) > fortnight) urgentCount += 1
                }
            }
        })
    }

    return (
        <div className={style.container}>
            <h3 className={style.main_title}>Today's data</h3>
            <div className={style.card_wrapper}>
                <div className={style.urgent_card}>
                    <div className={style.card_header}>
                        <div className={style.urgent}>
                            <span className={style.title}>Urgent Tasks</span>
                            <span className={style.urgent_value}>
                                {urgentCount}
                            </span>
                        </div>
                        <FontAwesomeIcon
                            icon={faFire}
                            className={style.urgent_icon}
                        />
                    </div>
                </div>
                <div className={style.incomplete_card}>
                    <div className={style.card_header}>
                        <div className={style.incomplete}>
                            <span className={style.title}>
                                Incomplete Tasks
                            </span>
                            <span className={style.incomplete_value}>
                                {incompleteCount}
                            </span>
                        </div>
                        <FontAwesomeIcon
                            icon={faClipboardList}
                            className={style.incomplete_icon}
                        />
                    </div>
                </div>
                <div className={style.completed_card}>
                    <div className={style.card_header}>
                        <div className={style.completed}>
                            <span className={style.title}>Completed Tasks</span>
                            <span className={style.completed_value}>
                                {completedCount}
                            </span>
                        </div>
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={style.completed_icon}
                        />
                    </div>
                </div>
                <div className={style.monthly_completed_card}>
                    <div className={style.card_header}>
                        <div className={style.monthly_completed}>
                            <span className={style.title}>
                                Monthly Completed Tasks
                            </span>
                            <span className={style.monthly_completed_value}>
                                {monthlyCompletedCount}
                            </span>
                        </div>
                        <FontAwesomeIcon
                            icon={faCalendarCheck}
                            className={style.monthly_completed_icon}
                        />
                    </div>
                </div>
            </div>
            {/* <p>{completedCount}</p>
            <p>{monthlyCompletedCount}</p>
            <p>{incompleteCount}</p> */}
        </div>
    )
}

export default Dashboard
