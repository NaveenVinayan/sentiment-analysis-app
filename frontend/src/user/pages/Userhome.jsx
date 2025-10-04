import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../../admin/components/AdminNavbar'
import { ToastContainer } from 'react-toastify'

const Userhome = () => {
  return (
    <div>
      <div className="flex-1  bg-gray-100 min-h-screen">
        <AdminNavbar />
        <div>
          <Outlet />
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} theme="colored" />
    </div>
  )
}

export default Userhome
