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
import { deleteProduct } from '../function/Helper';

const DeleteModal = ({ open, onClose, id_produit }) => {

    const [id, setId] = useState(null)

    useEffect(() => {
        if (id_produit !== null) {
            setId(id_produit)
        }
    }, [id_produit])

    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['products'] })
            queryclient.invalidateQueries({ queryKey: ['allProduct'] })
            queryclient.invalidateQueries({ queryKey: ['cart'] })
            queryclient.invalidateQueries({ queryKey: ['statistique'] })
            onClose()
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const deleteProduit = (id) => {
        if (id !== null) {
            mutation.mutate(id)
        }
    }


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Supprimer le Produits ?</DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
                <DialogContentText sx={{ margin: 2 }}>Voulez vous supprimer ce produit ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={onClose}>Non</Button>
                <Button variant='contained' color='warning' onClick={()=>deleteProduit(id)}>Oui</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteModal