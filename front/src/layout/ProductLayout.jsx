import { Box } from '@mui/material'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ProductLayout = () => {

    const [searchItem, setSearchItem] = useState('');
    return (
        <div>
            <Navbar setSearchItem={setSearchItem} />
            <Box sx={{ mt: 10 }}>
                <Outlet context={{searchItem}} />
            </Box>
        </div>
    )
}

export default ProductLayout