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
import { validateCommandes } from '../function/Helper';

const ValidateCommande = ({ open, onClose, id_produit }) => {

    const [id, setId] = useState(null)

    useEffect(() => {
        if (id_produit !== null) {
            setId(id_produit)
        }
    }, [id_produit])

    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: validateCommandes,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['allCommandes'] })
            onClose()
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const validateCommandeSubmit = (id) => {
        if (id !== null) {
            mutation.mutate(id)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Validé la commande ?</DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
                <DialogContentText sx={{ margin: 2 }}>Voulez vous validé cette Commande ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={onClose}>Non</Button>
                <Button variant='contained' color='primary' onClick={() => validateCommandeSubmit(id)}>Oui</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ValidateCommande