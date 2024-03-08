import React, { memo } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import style from "./Customer.module.css"
import { useGetCustomersQuery } from "./customersApiSlice"

const Customer = ({ customerId }) => {
    const { customer } = useGetCustomersQuery("customersList", {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[customerId],
        }),
    })

    const navigate = useNavigate()
    if (customer) {
        const handleEdit = () => navigate(`/dash/customers/${customerId}`)
        const content = (
            <tr>
                <td className={style.customer_table_cell}>
                    {customer.firstname.concat(" ", customer.surname)}
                </td>
                <td className={style.customer_table_cell}>
                    {customer.membership}
                </td>
                <td className={style.customer_table_cell}>{customer.phone}</td>
                <td className={style.customer_table_cell}>{customer.email}</td>
                <td className={style.customer_table_cell}>
                    <button
                        className={style.customer_table_button}
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon
                            className={style.icon}
                            icon={faPenToSquare}
                        />
                    </button>
                </td>
            </tr>
        )
        return content
    } else return null
}

const memoizedCustomer = memo(Customer)

export default memoizedCustomer
