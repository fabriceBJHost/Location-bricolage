import React, { useEffect, useState } from 'react'
import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    styled
}
    from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReservationByAdmin } from '../function/Helper';
import AxiosClient from '../api/AxiosClient';

const DeleteReservationModal = ({ open, onClose, id_produit }) => {

    const [formData, setFormData] = useState({
        id: '',
        qtt: '',
        product_id: '',
        user_id: ''
    })
    const [data, setData] = useState({});

    useEffect(() => {
        if (id_produit !== null) {
            AxiosClient.get(`reservation/${id_produit}`).then((response) => {
                setData(response.data.reservation)
            })
        }
    }, [id_produit])

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setFormData({
                id: id_produit,
                product_id: data.id_produit,
                qtt: data.qtt,
                user_id: data.id_client
            })
        }
    }, [data])


    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteReservationByAdmin,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['allReservation'] })
            queryclient.invalidateQueries({ queryKey: ['products'] })
            queryclient.invalidateQueries({ queryKey: ['Reservations'] })
            queryclient.invalidateQueries({ queryKey: ['cart'] })
            queryclient.invalidateQueries({ queryKey: ['cartCount'] })
            queryclient.invalidateQueries({ queryKey: ['allProduct'] })
            onClose()
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const reservationDelete = () => {
        mutation.mutate(formData)
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Validé le Réservation ?</DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
                <DialogContentText sx={{ margin: 2 }}>Voulez vous validé ce réservation ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={onClose}>Non</Button>
                <Button variant='contained' color='primary' onClick={reservationDelete}>Oui</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteReservationModal