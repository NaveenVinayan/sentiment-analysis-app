import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { toast } from 'react-toastify'
import { useAuth } from "../context/authContext";

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            toast.error('Please login to continue');
        }
    }, [loading, user])

    if (loading) {
        return <Loading />
    }

    return user ? children : <Navigate to="/login" />

}

export default PrivateRoutes