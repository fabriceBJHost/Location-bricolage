import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
    Grid,
    Container,
    Pagination,
    Box,
    Button,
    CardActions
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FetchToReservation, RemoveReservation } from '../function/Helper';
import { FaTrash } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Reservation = () => {

    const {
        data: reservation = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['Reservations'],
        queryFn: FetchToReservation
    });

    const ITEMS_PER_PAGE = 6;
    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedReservation = reservation.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: RemoveReservation,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['products'] })
            queryclient.invalidateQueries({ queryKey: ['cart'] })
            queryclient.invalidateQueries({ queryKey: ['cartCount'] })
            queryclient.invalidateQueries({ queryKey: ['Reservations'] })
            queryclient.invalidateQueries({ queryKey: ['allReservation'] })
            queryclient.invalidateQueries({ queryKey: ['Notification'] })
            queryclient.invalidateQueries({ queryKey: ['notifCount'] })
        },
        onError: (err) => {
            console.log(err);
            alert('erreur, veullez reesayer')
        }
    })

    const removeReservation = (formData) => {
        console.log(formData);
        mutation.mutate(formData);
    }

    return (
        <Container>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                    <Typography variant="h4" gutterBottom>
                        📦 Liste des Réservation
                    </Typography>
                </Grid>
            </Grid>

            {isPending ? (
                <Typography>Chargement...</Typography>
            ) : isError ? (
                <Typography color="error">Erreur : {error.message}</Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {paginatedReservation.map((produit) => (
                            <Grid item xs={12} sm={6} md={6} lg={3} key={produit.id}>
                                <Card sx={{ width: 365 }}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`http://127.0.0.1:8000${produit.image}`}
                                            alt={produit.nom}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6">
                                                {produit.nom}
                                            </Typography>
                                            <Typography gutterBottom variant="body2">
                                                Quantiter: {produit.qtt}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {produit.designation}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ width: "100%", display: 'flex', justifyContent: 'end' }}>
                                            <Button variant='contained' onClick={() => removeReservation({ id: produit.id, qtt: produit.qtt, product_id: produit.produit_id })} color='error' title='Ajouter au pannier'>
                                                <FaTrash />
                                            </Button>
                                        </CardActions>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={Math.ceil(reservation.length / ITEMS_PER_PAGE)}
                            page={page}
                            onChange={handleChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Container>
    )
}

export default Reservation