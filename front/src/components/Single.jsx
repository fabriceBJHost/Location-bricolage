import React, { useEffect, useState } from 'react'
import { Card, Typography, Container, CardMedia, CardContent, CardActions, Button, Grid, Box } from "@mui/material";
import image from '../assets/images/test.jpg'
import { FaShoppingCart } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosClient from '../api/AxiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddToCat } from '../function/Helper';


const Single = () => {

  const [single, setSingle] = useState({})
  const [statut, setStatut] = useState(400)
  const [disable, setDisable] = useState(false)

  const { id } = useParams();

  useEffect(() => {
    AxiosClient.get(`product/${Number(id)}`).then((response) => {
      setSingle(response.data.product)
      setStatut(response.status)
    })

    AxiosClient.get(`cart/isin/${id}`).then((response) => {
      setDisable(response.data.is_in)
    })
  }, [])

  const navigate = useNavigate();

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: AddToCat,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ['products'] })
      queryclient.invalidateQueries({ queryKey: ['cart'] })
      queryclient.invalidateQueries({ queryKey: ['cartCount'] })
      setDisable(true)
    },
    onError: (err) => {
      console.log(err);
      alert('erreur, veullez reesayer')
    }
  })

  const pressToCart = (product_id) => {
    mutation.mutate(product_id)
  }

  return (
    <Container>
      <Grid container spacing={3} justifyContent={'center'}>
        {
          statut == (404 || 500) ? (
            <Box
              height="100vh"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              // bgcolor="#f5f5f5"
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
          ) : (
            <Grid item xs={12}>
              <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, boxShadow: 3 }}>
                <CardMedia
                  component={"img"}
                  image={`http://127.0.0.1:8000${single.image}`}
                  alt={single.name}
                  sx={{ width: { xs: "100%", sm: 300 }, height: "auto" }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant='h5' component={'div'} gutterBottom>
                    {single.name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    {single.designation}
                  </Typography>
                  <Typography variant='h6' color='primary'>
                    {single.prix}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant='contained' onClick={()=> pressToCart(single.id)} color='primary' startIcon={<FaShoppingCart />} disabled={disable}>Ajouter au pannier</Button>
                </CardActions>
              </Card>
            </Grid>
          )
        }
      </Grid>
    </Container>
  )
}

export default Single