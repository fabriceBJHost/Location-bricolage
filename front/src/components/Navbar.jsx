import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { FaSearch, FaDirections, FaBars, FaShoppingCart, FaUser, FaEnvelope, FaImdb, FaList, FaCog, FaBell } from 'react-icons/fa';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import { List, Stack } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import icon from "../assets/images/icon.webp"
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classe from '../assets/styles/Navbar.module.css'
import { BiLogOut } from 'react-icons/bi';
import AxiosClient from '../api/AxiosClient';
import { useStateContext } from '../contexts/AuthCOntext';
import { BsList } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { useQuery } from '@tanstack/react-query';
import { getCountNotification } from '../function/Helper';

const Navbar = ({setSearchItem}) => {

    const { setToken } = useStateContext()
    const [user, setUser] = useState({})
    const [role, setRole] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        AxiosClient.get('user').then((response) => {
            console.log(response.data);

            if (!response.data.user) {
                setRole(0)
            } else {
                setRole(response.data.user.role)
            }
        })
    }, [])

    const fetchCardCount = async () => {
        const response = await AxiosClient.get('cart/count');
        return response.data.count
    }

    const {
        data: cartsCount = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['cartCount'],
        queryFn: fetchCardCount,
    });

    const {
        data: notifCount = [],
    } = useQuery({
        queryKey: ['notifCount'],
        queryFn: getCountNotification,
    });

    const [open, setOpen] = React.useState(false);

    console.log(cartsCount);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const location = useLocation()

    const logout = async () => {
        const response = await AxiosClient.post('logout')

        if (response.status == 200) {
            localStorage.removeItem('ACCESS_TOKEN')
            setToken(null)
        }
    }

    const DrawerList = (
        <Box sx={{ width: 250, height: '100%' }} role="presentation" >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <img src={icon} width={70} alt="" style={{ border: 'solid 3px rgb(151, 76, 63)', borderRadius: "100px", padding: 3, margin: 3 }} />
                <h3 style={{ color: "rgb(151, 76, 63)" }}>Location-Bricolage</h3>
            </div>
            <List onClick={toggleDrawer(false)}>
                {
                    role == 1 ? (
                        <Link to={'/dashboard'} className={classe.unlink}>
                            <ListItem disablePadding className={location.pathname == "/dashboard" ? classe.active : ""}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <MdDashboard />
                                    </ListItemIcon>
                                    <ListItemText primary={"Tableau de bord"} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ) : ""
                }

                <Link to={'/produits'} className={classe.unlink}>
                    <ListItem disablePadding className={(location.pathname == "/produits" || location.pathname == "/") ? classe.active : ""}>
                        <ListItemButton>
                            <ListItemIcon>
                                <FaList />
                            </ListItemIcon>
                            <ListItemText primary={"Produits"} />
                        </ListItemButton>
                    </ListItem>
                </Link>
                {/* eto */}
                <Link to={'/mareservation'} className={classe.unlink}>
                    <ListItem disablePadding className={location.pathname == "/mareservation" ? classe.active : ""}>
                        <ListItemButton>
                            <ListItemIcon>
                                <CgNotes />
                            </ListItemIcon>
                            <ListItemText primary={"Ma Réservation"} />
                        </ListItemButton>
                    </ListItem>
                </Link>
                {/* katreto */}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <FaCog />
                        </ListItemIcon>
                        <ListItemText primary={"Parametre"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={logout}>
                    <ListItemButton>
                        <ListItemIcon>
                            <BiLogOut />
                        </ListItemIcon>
                        <ListItemText primary={"Déconnection"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Paper
            component="form"
            sx={{ p: '2px 5%', display: 'flex', alignItems: 'center', width: "100%", position: "fixed", top: 0, zIndex: 999 }}
        >
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={toggleDrawer(true)}>
                <FaBars />
            </IconButton>
            <InputBase
                sx={{ ml: "5%", flex: .5 }}
                onFocus={
                    () => {
                        navigate('/')
                    }
                }
                onInput={(e) => setSearchItem(e.target.value)}
                placeholder="Recherche produit..."
                inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <FaSearch />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Stack direction="row" spacing={2}>
                <Link to={'/cart'}>
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="Pannier">
                        <Badge badgeContent={cartsCount} color="error">
                            <FaShoppingCart title='Pannier' />
                        </Badge>
                    </IconButton>
                </Link>
                <Link to={'/notification'}>
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="Notification">
                        <Badge badgeContent={notifCount} color="error">
                            <FaBell title='Notification' />
                        </Badge>
                    </IconButton>
                </Link>
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={() => window.history.back()}>
                    <FaDirections title='retour' />
                </IconButton>
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="avatar">
                    <Avatar sx={{ width: 30, height: 30 }}>
                        <FaUser />
                    </Avatar>
                </IconButton>
            </Stack>
        </Paper>

    )
}

export default Navbar