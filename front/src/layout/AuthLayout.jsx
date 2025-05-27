import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Box } from '@mui/material';
import { useStateContext } from '../contexts/AuthCOntext';


const AuthLayout = () => {
    const {token} = useStateContext()

    if (token) {
        return <Navigate to={"/"} />
    }
    return (
        // importena ny BOX avy am material UI, de iny hoentina anaovana style an le authlayout
        <Box
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="rgba(197, 197, 197, 0.603)"
            p={2}
            overflow="hidden"
        >
            
            {/* Content above particles */}
            <Box zIndex={1}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default AuthLayout