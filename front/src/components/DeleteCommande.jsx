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
import AxiosClient from '../api/AxiosClient';
import { deleteCommandes } from '../function/Helper';

const DeleteCommande = ({ open, onClose, id_produit }) => {

    const [formData, setFormData] = useState({
        id: '',
        qtt: '',
        product_id: '',
    })
    const [data, setData] = useState({});

    useEffect(() => {
        if (id_produit !== null) {
            AxiosClient.get(`commande/${id_produit}`).then((response) => {

                setData(response.data.commande)
            })
        }
    }, [id_produit])

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setFormData({
                id: id_produit,
                product_id: data.id_produit,
                qtt: data.quantiter,
            })
        }
    }, [data])


    const queryclient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteCommandes,
        onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ['products'] })
            queryclient.invalidateQueries({ queryKey: ['allProduct'] })
            queryclient.invalidateQueries({ queryKey: ['allCommandes'] })
            onClose()
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const deleteCommande = () => {
        // console.log(formData);
        
        mutation.mutate(formData)
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Supprimer commande ?</DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
                <DialogContentText sx={{ margin: 2 }}>Voulez vous supprimer ce commande ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={onClose}>Non</Button>
                <Button variant='contained' color='error' onClick={deleteCommande}>Oui</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCommande