import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Adminhome from '../pages/Adminhome'
import AdminDashboard from '../components/AdminDashboard'
import PrivateRoutes from '../../utils/PrivateRoutes'
import RoleBasedRoutes from '../../utils/RoleBasedRoutes'

const UserRoutes = () => {
    return (
        <Routes>

            <Route path='/' element={
                <PrivateRoutes >
                    <RoleBasedRoutes requiredRole={["admin"]}>
                        <Adminhome />
                    </RoleBasedRoutes>
                </PrivateRoutes>
            }>
                <Route index element={<AdminDashboard />}></Route>
            </Route>

        </Routes>
    )
}

export default UserRoutes
