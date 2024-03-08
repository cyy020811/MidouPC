import React, { useState } from "react"
import { useGetCustomersQuery } from "./customersApiSlice"
import Customer from "./Customer"
import style from "./CustomersList.module.css"
import { useNavigate } from "react-router-dom"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CustomersList = () => {
    const {
        data: customers,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetCustomersQuery("customersList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })
    const navigate = useNavigate()
    const [searchText, setSearchText] = useState("")
    const [membership, setMembership] = useState("membership")

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = customers

        const filteredIds = ids?.length
            ? ids.filter((customerId) => {
                  const customer = entities[customerId]
                  const name = customer.firstname.concat(" ", customer.surname)
                  if (
                      searchText.length &&
                      !name.match(searchText) &&
                      !customer.email.match(searchText) &&
                      !customer.phone.match(searchText)
                  ) {
                      return false
                  }
                  if (
                      membership !== "membership" &&
                      customer.membership !== membership
                  )
                      return false

                  return true
              })
            : null

        const tableContent = filteredIds?.length
            ? filteredIds.map((customerId) => (
                  <Customer key={customerId} customerId={customerId} />
              ))
            : null

        const handleCreateCustomer = () => navigate("/dash/customers/new")
        content = (
            <>
                <div className={style.search_bar}>
                    <input
                        type="search"
                        placeholder="Search"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        name="membership"
                        id="membership"
                        onChange={(e) => setMembership(e.target.value)}
                    >
                        <option value="membership">Membership</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                    </select>
                    <button onClick={handleCreateCustomer}>
                        <FontAwesomeIcon
                            icon={faSquarePlus}
                            className={style.icon}
                        />
                    </button>
                </div>
                <div className={style.table_container}>
                    <h3>Customers</h3>
                    <table className={style.customer_table}>
                        <thead className={style.table_thead}>
                            <tr>
                                <th
                                    scope="col"
                                    className={style.customer_table_th}
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className={style.customer_table_th}
                                >
                                    Membership
                                </th>
                                <th
                                    scope="col"
                                    className={style.customer_table_th}
                                >
                                    Phone
                                </th>
                                <th
                                    scope="col"
                                    className={style.customer_table_th}
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className={style.customer_table_th}
                                >
                                    Edit
                                </th>
                            </tr>
                        </thead>
                        <tbody>{tableContent}</tbody>
                    </table>
                </div>
            </>
        )
    }
    return content
}

export default CustomersList
