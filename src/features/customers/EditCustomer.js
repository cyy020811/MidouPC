import React from "react"
import { useParams } from "react-router-dom"
import EditCustomerForm from "./EditCustomerForm"
import { useGetCustomersQuery } from "./customersApiSlice"

const EditCustomer = () => {
    const { id } = useParams()

    const { customer } = useGetCustomersQuery("customersList", {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[id],
        }),
    })

    const content = customer ? (
        <EditCustomerForm customer={customer} />
    ) : (
        <p>Loading...</p>
    )

    return content
}

export default EditCustomer
