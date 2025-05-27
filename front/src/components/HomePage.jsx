import React, { useEffect, useState } from 'react'
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
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaEdit, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import AxiosClient from '../api/AxiosClient';
import AddProduct from './AddProduct';
import { useQuery } from '@tanstack/react-query';
import { AddToCat } from '../function/Helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const HomePage = () => {

  // const [produits, setProduits] = useState([]);
  const navigate = useNavigate();
  const { searchItem } = useOutletContext()

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const fetchProduct = async () => {
    const response = await AxiosClient.get('/product');
    return response.data.produits
  }

  const {
    data: produits = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProduct
  });

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: AddToCat,
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

  const pressToCart = (product_id) => {
    mutation.mutate(product_id)
  }

  const clickProduct = (id) => {
    setTimeout(() => {
      navigate(`/product/${id}`)
    }, 500);
  }

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProduits = produits.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const searchs = async (formData) => {
    if (formData.search != "") {
      const response = await AxiosClient.post('product/search', formData)
      console.log(response.data.search);

      return response.data.search
    }
  }

  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    if (searchItem && searchItem != "") {
      setIsSearch(true)
      let response = []
      response = searchs({ search: searchItem })


      response.then((response) => {
        setSearchResult(response);
      })

    } else {
      setIsSearch(false)
    }
  }, [searchItem])

  const paginatedSearch = searchResult.slice(startIndex, startIndex + ITEMS_PER_PAGE);


  const [isSearch, setIsSearch] = useState(false);


  return (
    <Container sx={{ mt: 5 }} >
      <Grid container spacing={2} alignItems="center" justifyContent={"space-between"}>
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            📦 Liste des Produits
          </Typography>
        </Grid>
      </Grid>

      {isSearch == false ? (
        <>
          {isPending ? (
            <Typography>Chargement...</Typography>
          ) : isError ? (
            <Typography color="error">Erreur : {error.message}</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProduits.map((produit) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={produit.id}>
                    <Card sx={{ width: 365 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://127.0.0.1:8000${produit.image}`}
                          alt={produit.nom}
                          sx={{ objectFit: 'cover' }}
                          onClick={() => clickProduct(produit.id)}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6">
                            {produit.nom}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {produit.designation}
                          </Typography>
                        </CardContent>
    
                        <CardActions sx={{ width: "100%", display: 'flex', justifyContent: 'end' }}>
                          <Button variant='contained' onClick={() => { pressToCart(produit.id) }} title='Ajouter au pannier'>
                            <FaShoppingCart />
                          </Button>
                        </CardActions>
    
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
    
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(produits.length / ITEMS_PER_PAGE)}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <>
        <Grid container spacing={3}>
                {paginatedSearch.map((produit) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={produit.id}>
                    <Card sx={{ width: 365 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://127.0.0.1:8000${produit.image}`}
                          alt={produit.nom}
                          sx={{ objectFit: 'cover' }}
                          onClick={() => clickProduct(produit.id)}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6">
                            {produit.nom}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {produit.designation}
                          </Typography>
                        </CardContent>
    
                        <CardActions sx={{ width: "100%", display: 'flex', justifyContent: 'end' }}>
                          <Button variant='contained' onClick={() => { pressToCart(produit.id) }} title='Ajouter au pannier'>
                            <FaShoppingCart />
                          </Button>
                        </CardActions>
    
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
    
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(searchResult.length / ITEMS_PER_PAGE)}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                />
              </Box>
        </>
      )}

      


    </Container>
  );
}

export default HomePage