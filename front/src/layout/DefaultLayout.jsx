import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/AuthCOntext';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import classe from '../assets/styles/AddProduct.module.css'

const DefaultLayout = () => {

  const {token} = useStateContext()

    if (!token) {
        return <Navigate to={"/login"} />
    }

  return (
    <div>
        <Navbar />
        <Box sx={{mt: 10}}>
          <Outlet />
        </Box>
    </div>
  )
}

export default DefaultLayout