import React from "react"
import { useAuth } from "../context/authContext"
import { Navigate } from "react-router-dom"
import Loading from './Loading'

const RoleBasedRoutes = ({ children, requiredRole }) => {
    const { user, loading } = useAuth()


    if (loading) {
        return <Loading />

    }

    if (!requiredRole.includes(user.role)) {
        return <Navigate to="/" />
    }
    return user ? children : <Navigate to="/login" />
}

export default RoleBasedRoutes
