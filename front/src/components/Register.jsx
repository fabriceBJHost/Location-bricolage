import { Box, Grid, TextField, InputAdornment, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import { FaEnvelope, FaEye, FaEyeSlash, FaKey, FaUser, FaUserCircle, FaUserPlus } from 'react-icons/fa'
import classe from '../assets/styles/Auth.module.css'
import { Link } from 'react-router-dom'
import AxiosClient from '../api/AxiosClient';
import { useStateContext } from '../contexts/AuthCOntext'

const Register = () => {

  const [clicked, setClicked] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [nameError, setNameError] = useState(false)
  const [nameErrorMessage, setNameErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    const response = await AxiosClient.post('register', formData);

    console.log(response);

    if (response.data.errors) {
      const error = response.data.errors

      if (error.name) {
        setNameError(true)
        setNameErrorMessage(error.name[0])
      } else {
        setNameError(false)
        setNameErrorMessage('')
      }

      if (error.email) {
        setEmailError(true)
        setEmailErrorMessage(error.email[0])
      } else {
        setEmailError(false)
        setEmailErrorMessage('')
      }
      if (error.password) {
        setPasswordError(true)
        setPasswordErrorMessage(error.password[0])
      } else {
        setPasswordError(false)
        setPasswordErrorMessage('')
      }
    }

    if (response.status == 201) {
      setPasswordError(false)
      setPasswordErrorMessage('')
      setEmailError(false)
      setEmailErrorMessage('')
      setNameError(false)
      setNameErrorMessage('')
      setOpen(true)
    }

  }

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const dialogModal = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Succès"}
        </DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <DialogContentText id="alert-dialog-description">
            Vous êtes entegistrer, veuillez vous connecter !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to={'/login'}>
            <Button onClick={handleClose}>OK</Button>
          </Link>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {dialogModal()}
      <form className={classe.form} onSubmit={formSubmit}>
        <Paper className={classe.paper}>
          <Grid container spacing={2}>
            <h1 className={classe.title}><FaUserPlus /></h1>
            <Grid size={12}>
              <TextField
                label="Nom"
                placeholder='Entrer votre nom...'
                color='primary'
                error={nameError}
                type='text'
                fullWidth
                name='name'
                helperText={nameErrorMessage}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaUser className={classe.icons} />
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
              <TextField
                label="Email"
                placeholder='Entrer votre email...'
                color='primary'
                error={emailError}
                type='email'
                fullWidth
                name='email'
                helperText={emailErrorMessage}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope className={classe.icons} />
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
              <TextField
                label="Mot de passe"
                placeholder='Entrer votre mot de passe...'
                color='primary'
                type={clicked ? 'text' : 'password'}
                fullWidth
                error={passwordError}
                helperText={passwordErrorMessage}
                name='password'
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaKey className={classe.icons} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="start">
                        {
                          clicked ? <FaEyeSlash className={classe.icon2} onClick={() => setClicked(!clicked)} /> : <FaEye className={classe.icon2} onClick={() => setClicked(!clicked)} />
                        }
                      </InputAdornment>
                    )
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
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Link to={'/login'}>
                    <Button fullWidth variant='contained' color='success'>Se connecter</Button>
                  </Link>
                </Grid>
                <Grid size={6}>
                  <Button fullWidth variant='contained' color='primary' type='submit'>S'inscrire</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Box>
  )
}

export default Register