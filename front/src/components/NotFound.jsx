import React from 'react'
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f5f5f5"
            textAlign="center"
            p={2}
        >
            <Typography variant="h1" color="primary" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Oups ! La page que vous recherchez n'existe pas.
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={4}>
                Il a peut-être été déplacé ou supprimé.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Retour sur Accueil
            </Button>
        </Box>
    )
}

export default NotFound