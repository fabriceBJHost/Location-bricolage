import { Button, Container, Grid, IconButton, Typography, Tooltip, Pagination, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { FaBellSlash, FaMinusCircle } from 'react-icons/fa'
import { getNotification, makeNotificationSeen } from '../function/Helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import classe from '../assets/styles/Notification.module.css'

const Notification = () => {

  // notification
  const {
    data: notification = [],
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['Notification'],
    queryFn: getNotification,
  });

  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedNotification = notification.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: makeNotificationSeen,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ['Notification'] })
      queryclient.invalidateQueries({ queryKey: ['notifCount'] })
      onClose()
    },
    onError: (err) => {
      console.log(err);
    }
  })

  const makeOneSeen = (id) => {
    mutation.mutate(id)
  }

  return (
    <Container maxWidth='sm' sx={{ borderLeft: 'solid 1px gray', borderRight: 'solid 1px gray', minHeight: '80vh' }}>
      <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'} sx={{ borderBottom: "solid 1px gray", marginBottom: "1%" }}>
        <Grid size={6}>
          <Typography variant='h6'>
            Notification
          </Typography>
        </Grid>
        <Grid size={6} sx={{ textAlign: 'right' }}>
          <Tooltip title="Tous marquer comme lus" arrow placement='right'>
            <IconButton color='primary'>
              <FaBellSlash />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {isPending ? (
          <Typography>Chargement...</Typography>
        ) : isError ? (
          <Typography color="error">Erreur : {error.message}</Typography>
        ) : (
          <>
            {
              paginatedNotification.map((notif) => (
                <Grid size={12} className={notif.seen == 0 ? classe.notSeen : classe.seen}>
                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid size={11} sx={{ textAlign: 'justify' }}>
                      <Typography variant='body2'>
                        {notif.description}
                      </Typography>
                    </Grid>
                    <Grid size={1}>
                      <Tooltip title="Marquer comme lus" arrow placement='right'>
                        <IconButton color='primary' onClick={()=>makeOneSeen(notif.id)} disabled={notif.seen == 1}>
                          <FaMinusCircle />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

            <Box display="flex" justifyContent="center" mt={4} sx={{ textAlign: 'center', width: "100%" }}>
              <Pagination
                count={Math.ceil(notification.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handleChange}
                color="primary"
              />
            </Box>
          </>

        )}

      </Grid>
    </Container>
  )
}

export default Notification