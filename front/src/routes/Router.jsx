import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import AuthLayout from "../layout/AuthLayout";
import NotFound from "../components/NotFound";
import HomePage from '../components/HomePage'
import Login from '../components/Login'
import Register from '../components/Register'
import Single from "../components/Single";
import Notification from "../components/Notification";
import ProductLayout from "../layout/ProductLayout";
import Product from "../components/Product";
import Cart from "../components/Cart";
import Reservation from "../components/Reservation";
import Dashboard from "../components/Dashboard";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <ProductLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/produits',
                element: <HomePage />
            },
        ]
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/product/:id',
                element: <Single />
            },
            {
                path: '/notification',
                element: <Notification />
            },
            {
                path: '/cart',
                element: <Cart />
            },
            {
                path: '/mareservation',
                element: <Reservation />
            },
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
        ]
    },
    {
        path: '/*',
        element: <NotFound />
    }
]);

export default Router;