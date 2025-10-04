import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Userhome from '../pages/Userhome'
import Homepage from '../components/Homepage'
import PrivateRoutes from '../../utils/PrivateRoutes'
import RoleBasedRoutes from '../../utils/RoleBasedRoutes'

const UserRoutes = () => {
    return (
        <Routes>

            <Route path='/' element={
                <PrivateRoutes >
                    <RoleBasedRoutes requiredRole={["user", "admin"]}>
                        <Userhome />
                    </RoleBasedRoutes>
                </PrivateRoutes>
            }>
                <Route index element={<Homepage />}></Route>
            </Route>

        </Routes>
    )
}

export default UserRoutes
