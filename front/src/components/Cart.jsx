import React, { useState } from 'react'
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    IconButton,
    Container,
    Box
}
    from '@mui/material'
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';
import AxiosClient from '../api/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { RemoveToCart, ReservedFromCart } from '../function/Helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Cart = () => {

    const fetchCard = async () => {
        const response = await AxiosClient.get('cart')

        return response.data.carts;
    }

    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: RemoveToCart,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['products'] })
            queryclient.invalidateQueries({ queryKey: ['cart'] })
            queryclient.invalidateQueries({ queryKey: ['cartCount'] })
        },
        onError: (err) => {
            console.log(err);
            alert('erreur, veullez reesayer')
        }
    })

    const {
        data: carts = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCard,
    });

    const [qtt, setqtt] = useState({})


    // useEffect(() => {
    //     const initialQtt = {}
    //     product.forEach(p => {
    //         initialQtt[p.id] = 1
    //     })
    //     setqtt(initialQtt)
    // }, [])

    const updateQtt = (productId, change) => {
        setqtt(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }))
    }

    const reservedMutation = useMutation({
        mutationFn: ReservedFromCart,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['products'] })
            queryclient.invalidateQueries({ queryKey: ['cart'] })
            queryclient.invalidateQueries({ queryKey: ['cartCount'] })
            queryclient.invalidateQueries({ queryKey: ['Reservations'] })
            queryclient.invalidateQueries({ queryKey: ['allProduct'] })
            queryclient.invalidateQueries({ queryKey: ['allReservation'] })
            queryclient.invalidateQueries({ queryKey: ['Notification'] })
            queryclient.invalidateQueries({ queryKey: ['notifCount'] })
            // mbola asina reservation mutation
        }, onError: (err) => {
            alert('erreur, veullez reesayer')
            console.log(err);
            console.log('hvgvgv');
            
        }
    })

    const removeFromCart = (product_id) => {
        mutation.mutate(product_id)
    }

    

    const reserved = (qtt, product_id) => {
        let quantiter = qtt; // {1: 3, 4: 5, 6: 1}
        let formData = { qtt: quantiter[`${product_id}`], product_id }; // quantiter[4] = 5
        if (formData.qtt == undefined) {
            formData.qtt = 1;
        }

        reservedMutation.mutate(formData);

    }

    // console.log(carts);

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {
                    isPending ? (
                        <Typography>Chargement...</Typography>
                    ) : isError ? (
                        <Typography color="error">Erreur : {error.message}</Typography>
                    ) : carts.map((prod) => (
                        <Grid item xs={12} sm={6} md={4} key={prod.id}>
                            <Card>
                                <CardMedia
                                    component={'img'}
                                    height={140}
                                    image={`http://127.0.0.1:8000${prod.image}`}
                                    alt={prod.nom}
                                />
                                <CardContent>
                                    <Typography variant='h6'>{prod.nom}</Typography>
                                    <Typography variant='body2' color='text.secondary'>${prod.prix}</Typography>

                                    {/* qtt controll */}
                                    <Box sx={{ display: "flex", alignItems: "center", mt: 2, justifyContent: 'center' }}>
                                        <IconButton onClick={() => updateQtt(prod.id, -1)} color='primary'>
                                            <FaMinus />
                                        </IconButton>
                                        <Typography variant='h6' sx={{ mx: 2 }}>{qtt[prod.id] || 1}</Typography>
                                        <IconButton onClick={() => updateQtt(prod.id, 1)} color='primary'>
                                            <FaPlus />
                                        </IconButton>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <Button fullWidth color='primary' variant='contained' startIcon={<FaShop />} onClick={() => reserved(qtt, prod.id)}>Reserver</Button>
                                        </Grid>
                                        <Grid size={6}>
                                            <Button fullWidth color='error' variant='contained' startIcon={<FaTrash />} onClick={() => removeFromCart(prod.id)}>Supprimer</Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    )
}

export default Cart