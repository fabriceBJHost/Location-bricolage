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
import { ValidateReservation } from '../function/Helper';

const ValidateReservationModal = ({ open, onClose, id_produit }) => {

    const [id, setId] = useState(null)

    useEffect(() => {
        if (id_produit !== null) {
            setId(id_produit)
        }
    }, [id_produit])

    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ValidateReservation,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['allReservation'] })
            queryclient.invalidateQueries({ queryKey: ['Reservations'] })
            queryclient.invalidateQueries({ queryKey: ['allCommandes'] })
            queryclient.invalidateQueries({ queryKey: ['Notification'] })
            queryclient.invalidateQueries({ queryKey: ['notifCount'] })
            onClose()
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const reservationValidate = (id) => {
        if (id !== null) {
            mutation.mutate(id)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Validé le Réservation ?</DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
                <DialogContentText sx={{ margin: 2 }}>Voulez vous validé ce réservation ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={onClose}>Non</Button>
                <Button variant='contained' color='primary' onClick={() => reservationValidate(id)}>Oui</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ValidateReservationModal