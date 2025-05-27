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
import { AiFillProduct } from 'react-icons/ai';
import { FaDollarSign, FaList, FaUpload } from 'react-icons/fa';
import { FiBox } from 'react-icons/fi';
import AxiosClient from '../api/AxiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../function/Helper';

const UpdateProduct = ({ open, onClose, id_produit }) => {

  const [formData, setFormData] = useState({
    nom: "",
    designation: "",
    prix: "",
    image: "",
    images: '',
    qtt: '',
    id: ''
  })

  const [product, setProduct] = useState({})

  useEffect(() => {
    if (id_produit !== null) {
      AxiosClient.get(`product/${id_produit}`).then((response) => {
        setProduct(response.data.product)
      })
    }
  }, [id_produit])

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setFormData({
        nom: product.nom,
        designation: product.designation,
        prix: product.prix,
        image: "",
        images: product.image,
        qtt: product.qtt,
        id: id_produit
      })
    }
  }, [product])



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file)

      setFormData(prev => ({
        ...prev,
        image: imageURL,
        images: e.target.files[0]
      }))
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ['products'] })
      queryclient.invalidateQueries({ queryKey: ['allProduct'] })
      queryclient.invalidateQueries({ queryKey: ['cart'] })
      queryclient.invalidateQueries({ queryKey: ['statistique'] })
      setFormData({ image: '', images: '', nom: '', designation: '', prix: '', qtt: '' })
      onClose(true)
    },
    onError: (err) => {
      console.log(err);

    }
  })

  const formSubmit = async (e) => {
    e.preventDefault()
    // console.log(formData);
    // const response = await AxiosClient.post('product/store', formData)

    // console.log(response);
    mutation.mutate(formData)

  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formSubmit}>
        <DialogTitle>Modifier un Produits</DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <DialogContentText sx={{ margin: 2 }}>Entrer l'information du produit</DialogContentText>

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="Nom"
                placeholder='Entrer le nom du produits...'
                color='primary'
                type='text'
                required
                value={formData.nom || ""}
                fullWidth
                name='nom'
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AiFillProduct />
                      </InputAdornment>
                    ),
                  },
                }}

                sx={{
                  '& label.Mui-focused': {
                    color: 'primary.main',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Prix"
                placeholder='Entrer le prix du produits...'
                color='primary'
                type='number'
                required
                fullWidth
                value={formData.prix || ""}
                name='prix'
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaDollarSign />
                      </InputAdornment>
                    ),
                  },
                }}

                sx={{
                  '& label.Mui-focused': {
                    color: 'primary.main',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Quantiter"
                placeholder='Designation du produits...'
                color='primary'
                type='number'
                required
                variant='outlined'
                fullWidth
                value={formData.qtt || ""}
                name='qtt'
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiBox />
                      </InputAdornment>
                    ),
                  },
                }}

                sx={{
                  '& label.Mui-focused': {
                    color: 'primary.main',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Description"
                placeholder='Designation du produits...'
                color='primary'
                type='text'
                required
                multiline
                value={formData.designation || ""}
                rows={2}
                variant='outlined'
                fullWidth
                name='designation'
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaList />
                      </InputAdornment>
                    ),
                  },
                }}

                sx={{
                  '& label.Mui-focused': {
                    color: 'primary.main',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              {
                formData.image == '' ? (
                  <img src={`http://127.0.0.1:8000${formData.images}`}
                    style={{ maxWidth: "100%", marginTop: 10 }}
                  />
                ) : (
                  <img src={formData.image}
                    style={{ maxWidth: "100%", marginTop: 10 }}
                  />
                )
              }
            </Grid>
            <Grid size={12}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<FaUpload />}
                fullWidth
              >
                Photos du Produit
                <VisuallyHiddenInput
                  type="file"
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {
            formData.image != '' && (
              <Button variant='contained' type='reset' color='error' onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  image: ""
                }))
              }}>Effacer image</Button>
            )
          }
          <Button variant='contained' type='submit'>Envoyer</Button>
        </DialogActions>
      </form>
    </Dialog >
  )
}

export default UpdateProduct