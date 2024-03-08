import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import UsersList from "./features/users/UsersList"
import TasksList from "./features/tasks/TasksList"
import ProductsList from "./features/products/ProductsList"
import Profile from "./features/profile/Profile"
import CustomersList from "./features/customers/CustomersList"
import Dashboard from "./components/Dashboard"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import EditTask from "./features/tasks/EditTask"
import NewTask from "./features/tasks/NewTask"
import EditProduct from "./features/products/EditProduct"
import EditCustomer from "./features/customers/EditCustomer"
import NewCustomerForm from "./features/customers/NewCustomerForm"
import Prefetch from "./features/auth/Prefetch"
import NewProductForm from "./features/products/NewProductForm"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"

function App() {
    useTitle("MidouPC")
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Login />} />
                <Route element={<PersistLogin />}>
                    <Route
                        element={
                            <RequireAuth
                                allowedRoles={[...Object.values(ROLES)]}
                            />
                        }
                    >
                        <Route element={<Prefetch />}>
                            <Route path="dash" element={<DashLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route
                                    element={
                                        <RequireAuth
                                            allowedRoles={[
                                                ROLES.Admin,
                                                ROLES.Manager,
                                            ]}
                                        />
                                    }
                                >
                                    <Route path="users">
                                        <Route index element={<UsersList />} />
                                        <Route
                                            path=":id"
                                            element={<EditUser />}
                                        />
                                        <Route
                                            path="new"
                                            element={<NewUserForm />}
                                        />
                                    </Route>
                                </Route>
                                <Route path="tasks">
                                    <Route index element={<TasksList />} />
                                    <Route path=":id" element={<EditTask />} />
                                    <Route path="new" element={<NewTask />} />
                                </Route>
                                <Route path="products">
                                    <Route index element={<ProductsList />} />

                                    <Route
                                        path=":id"
                                        element={<EditProduct />}
                                    />
                                    <Route
                                        path="new"
                                        element={<NewProductForm />}
                                    />
                                </Route>
                                <Route path="customers">
                                    <Route index element={<CustomersList />} />
                                    <Route
                                        path=":id"
                                        element={<EditCustomer />}
                                    />
                                    <Route
                                        path="new"
                                        element={<NewCustomerForm />}
                                    />
                                </Route>
                                <Route path="profile">
                                    <Route index element={<Profile />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default App
