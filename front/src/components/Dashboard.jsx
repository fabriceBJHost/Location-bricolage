import React, { useState } from 'react'
import { Box, Button, Container, Grid, Typography, Tooltip as Toll } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { frFR } from "@mui/x-data-grid/locales"
import classe from "../assets/styles/Dashboard.module.css"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query'
import { fetchAllProduct, fetchAllReservation, fetchStat, getCommande } from '../function/Helper'
import { FaCheck, FaCheckDouble, FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import UpdateProduct from './UpdateProduct'
import DeleteModal from './DeleteModal'
import ValidateReservationModal from './ValidateReservationModal'
import DeleteReservationModal from './DeleteReservationModal'
import DeleteCommande from './DeleteCommande'
import ValidateCommande from './ValidateCommande'
import AddProduct from './AddProduct'

// Register the components you want to use
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {

    // statistique
    const {
        data: stat = [],
    } = useQuery({
        queryKey: ['statistique'],
        queryFn: fetchStat,
    });

    // all product
    const {
        data: allProduct = [],
    } = useQuery({
        queryKey: ['allProduct'],
        queryFn: fetchAllProduct,
    });

    // all reservation
    const {
        data: allReservation = [],
    } = useQuery({
        queryKey: ['allReservation'],
        queryFn: fetchAllReservation,
    });

    // all commande
    const {
        data: allCommandes = [],
    } = useQuery({
        queryKey: ['allCommandes'],
        queryFn: getCommande,
    });

    // Example chart data
    const data = {
        labels: ['Produits', 'En stock', 'En Rupture de Stock'],
        datasets: [
            {
                label: ['Produits'],
                data: [stat.allProduct, stat.productStock, stat.productRuptureStock],
                borderColor: ['rgba(75,192,192,1)', 'rgba(107, 245, 43, 0.8)', 'rgba(255, 57, 57, 0.8)'],
                backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(107, 245, 43, 0.4)', 'rgba(255, 57, 57, 0.4)'],
                tension: 0.4
            }
        ]
    };

    // Optional chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Statistique des produits'
            }
        }
    };

    const columns = [
        // { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Client', width: 150, editable: false, },
        { field: 'produit', headerName: 'Produits', width: 150, editable: false, },
        { field: 'qtt', headerName: 'Quantiter', width: 100, editable: false, },
        { field: 'somme', headerName: 'Montant', width: 150, editable: false, },
        {
            field: 'action', headerName: 'Action', flex: 1, editable: false, renderCell(props) {
                return (
                    <Box>
                        <Grid container spacing={2} pr={1}>
                            <Grid size={6}>
                                <Toll title="Valider" arrow placement='right'>
                                    <Button variant='contained' color='success' onClick={() => openModalValidateReservation(props.value)}><FaCheck /></Button>
                                </Toll>
                            </Grid>
                            <Grid size={6}>
                                <Toll title="Supprimer" arrow placement='right'>
                                    <Button variant='contained' color='error' onClick={() => openModalDeleteReservation(props.value)}><FaTrash /></Button>
                                </Toll>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }
        },
    ];

    const rowsReservation = allReservation.map((reservation) => ({
        id: reservation.id,
        nom: reservation.nom_client,
        produit: reservation.nom,
        qtt: reservation.qtt,
        somme: reservation.somme_payer,
        action: reservation.id
    }));

    const columnAllProduct = [
        { field: 'nom', headerName: 'Nom', width: 180, editable: false },
        { field: 'description', headerName: 'Déscription', flex: 1, editable: false },
        { field: 'qtt', headerName: 'Quantité', width: 100, editable: false },
        { field: 'prix', headerName: 'Prix', width: 150, editable: false },
        {
            field: 'image', headerName: 'Image', width: 90, editable: false, renderCell(props) {
                return (
                    <div>
                        <img src={`http://127.0.0.1:8000${props.value}`} alt="" width={50} height={50} style={{ borderRadius: '100px', objectFit: 'cover' }} />
                    </div>
                )
            }
        },
        {
            field: 'action', headerName: 'Action', width: 150, editable: false, renderCell(props) {
                return (
                    <Box>
                        <Grid container spacing={2} pr={1}>
                            <Grid size={6}>
                                <Toll title="Modifier" arrow placement='right'>
                                    <Button variant='contained' color='primary' onClick={() => openModalUpdateProduct(props.value)}><FaEdit /></Button>
                                </Toll>
                            </Grid>
                            <Grid size={6}>
                                <Toll title="Supprimer" arrow placement='right'>
                                    <Button variant='contained' color='error' onClick={() => openModalDeleteProduct(props.value)}><FaTrash /></Button>
                                </Toll>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }
        },
    ];

    const rowAllProduct = allProduct.map((product) => ({
        id: product.id,
        nom: product.nom,
        description: product.designation,
        qtt: product.qtt,
        prix: product.prix,
        image: product.image,
        action: product.id
    }));

    const ColumnCommandes = [
        { field: 'client', headerName: 'Client', flex: 1, editable: false },
        { field: 'produit', headerName: 'Produit', flex: 1, editable: false },
        { field: 'qtt', headerName: 'Quantité', flex: 1, editable: false },
        { field: 'somme', headerName: 'Montant', flex: 1, editable: false },
        { field: 'status', headerName: 'Statuts', flex: 1, editable: false },
        {
            field: 'action', headerName: 'Action', flex: 1, editable: false, renderCell(props) {
                return (
                    props.row.status == "Non Réglé" && (
                        <Box>
                            <Grid container spacing={2} pr={1}>
                                <Grid size={6}>
                                    <Toll title="Réglé ?" arrow placement='right'>
                                        <Button variant='contained' color='success' onClick={() => openValidateCommandeModal(props.value)}><FaCheckDouble /></Button>
                                    </Toll>
                                </Grid>
                                <Grid size={6}>
                                    <Toll title="Supprimer" arrow placement='right'>
                                        <Button variant='contained' color='error' onClick={() => openDeleteCommandeModal(props.value)}><FaTrash /></Button>
                                    </Toll>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                )
            }
        },
    ];

    const returnStatus = (statuId) => {
        if (statuId == 0) {
            return "Non Réglé"
        } else {
            return "Réglé"
        }
    }

    const RowCommandes = allCommandes.map((commande) => ({
        id: commande.id,
        client: commande.nom_client,
        produit: commande.nom,
        qtt: commande.quantiter,
        status: returnStatus(commande.statut),
        somme: commande.somme_payer,
        action: commande.id,
    }));

    // modal update product
    const [openUpdateProduct, setOpenUpdateProduct] = useState(false)
    const [idProduitUpdate, setIdProduitUpdate] = useState(null);

    const clodeModalUpdateProduct = () => {
        setOpenUpdateProduct(false)
    }

    const openModalUpdateProduct = (id) => {
        setOpenUpdateProduct(true)
        setIdProduitUpdate(id)
    }

    // modal delete product
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [idProduitDelete, setIdProduitDelete] = useState(null);

    const clodeModalDeleteProduct = () => {
        setOpenDeleteModal(false)
    }

    const openModalDeleteProduct = (id) => {
        setOpenDeleteModal(true)
        setIdProduitDelete(id)
    }

    // modal to validate reservation
    const [openReservationValidate, setOpenReservationValidate] = useState(false)
    const [idReservationValidate, setIdReservationValidate] = useState(null)

    const closeModalValidateReservation = () => {
        setOpenReservationValidate(false)
    }

    const openModalValidateReservation = (id) => {
        setOpenReservationValidate(true)
        setIdReservationValidate(id)
    }

    // modal delete Reservation
    const [openDeleteReservation, setOpenDeleteReservation] = useState(false)
    const [idDeleteReservation, setIdDeleteReservation] = useState(null)

    const closeModalDeleteReservation = () => {
        setOpenDeleteReservation(false)
    }

    const openModalDeleteReservation = (id) => {
        setOpenDeleteReservation(true)
        setIdDeleteReservation(id)
    }

    // modal to delete commande
    const [openDeleteCommande, setOpenDeleteCommande] = useState(false)
    const [idDeleteCommande, setIdDeleteCommande] = useState(null);

    const closeDeleteModalCommande = () => {
        setOpenDeleteCommande(false)
    }

    const openDeleteCommandeModal = (id) => {
        setOpenDeleteCommande(true)
        setIdDeleteCommande(id)
    }

    // validate commande
    const [openValidateCommande, setOpenValidateCommande] = useState(false)
    const [idValidateCommande, setIdValidateCommande] = useState(null);

    const closeValidateModalCommande = () => {
        setOpenValidateCommande(false)
    }

    const openValidateCommandeModal = (id) => {
        setOpenValidateCommande(true)
        setIdValidateCommande(id)
    }

    // open modal add produits
    const [openModal, setOpenModal] = useState(false);

    const onCloseModal = () => {
        setOpenModal(false);
      }

    return (
        <Container sx={{ mt: 5, pb: 3 }} maxWidth={'xm'}>
            <AddProduct onClose={onCloseModal} onSuccess={() => { }} open={openModal} />
            <UpdateProduct onClose={clodeModalUpdateProduct} open={openUpdateProduct} id_produit={idProduitUpdate} />
            <DeleteModal onClose={clodeModalDeleteProduct} open={openDeleteModal} id_produit={idProduitDelete} />
            <ValidateReservationModal id_produit={idReservationValidate} onClose={closeModalValidateReservation} open={openReservationValidate} />
            <DeleteReservationModal id_produit={idDeleteReservation} onClose={closeModalDeleteReservation} open={openDeleteReservation} />
            <DeleteCommande id_produit={idDeleteCommande} onClose={closeDeleteModalCommande} open={openDeleteCommande} />
            <ValidateCommande id_produit={idValidateCommande} onClose={closeValidateModalCommande} open={openValidateCommande} />
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                    <Typography variant="h4" gutterBottom>
                        Tableau de bord
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid size={5} className={classe.shadow}>
                    <Bar data={data} options={options} />
                </Grid>
                <Grid size={7} className={classe.shadow}>
                    <Typography variant="h6" gutterBottom>
                        Listes des réservations
                    </Typography>
                    <DataGrid
                        rows={rowsReservation}
                        columns={columns}

                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        filterMode='client'
                        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                        className={classe.datagrid}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Grid>
                <Grid size={12} className={classe.shadow}>
                    <Typography variant="h6" gutterBottom>
                        Listes des Commandes
                    </Typography>
                    <DataGrid
                        // rows={rows}
                        columns={ColumnCommandes}
                        rows={RowCommandes}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        className={classe.datagrid}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Grid>
                <Grid size={12} className={classe.shadow}>
                    <Grid container spacing={2}>
                        <Grid size={10}>
                            <Typography variant="h6" gutterBottom>
                                Listes des produits
                            </Typography>
                        </Grid>
                        <Grid size={2}>
                            <Toll title={'Ajouter un produit'} arrow placement='right'>
                                <Button color='primary' variant='contained' onClick={() => setOpenModal(true)}>
                                    <FaPlus />
                                </Button>
                            </Toll>
                        </Grid>
                    </Grid>
                    <DataGrid
                        // rows={rows}
                        columns={columnAllProduct}
                        rows={rowAllProduct}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        className={classe.datagrid}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard