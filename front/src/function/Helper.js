import AxiosClient from "../api/AxiosClient"

export const AddToCat = async (product_id) => {
    const response = await AxiosClient.post('cart/store', {product_id})
    return response.data.mesage
}

export const RemoveToCart = async (product_id) => {
    const  response = await AxiosClient.post(`cart/delete/${product_id}`);
    return response.data.message
}

export const ReservedFromCart = async (formData) => {
    const response = await AxiosClient.post('cart/reserve', formData)
    
    return response.data.message
}
// ------------------------------
export const FetchToReservation = async () => {
    const response = await AxiosClient.get('reservation');

    return response.data.reservations
}

export const RemoveReservation = async (formData) => {
    const response = await AxiosClient.post(`reservation/delete/${formData.id}`, formData);

    return response.data.message
}

export const fetchStat = async () => {
    const response = await AxiosClient.get('product/stat');

    return response.data
}

export const fetchAllProduct = async () => {
    const response = await AxiosClient.get('product/all');

    return response.data.produits
}

export const fetchAllReservation = async () => {
    const response = await AxiosClient.get('reservation/all');

    return response.data.reservations
}
// ------------------------------------------------------
export const updateProduct = async (formData) => {
    const response = await AxiosClient.post(`product/update/${formData.id}`, formData);

    return response.data.message
}

export const deleteProduct = async (id) => {
    const response = await AxiosClient.post(`product/delete/${id}`);

    return response.data.message
}

export const ValidateReservation = async (id) => {
    const response = await AxiosClient.post(`reservation/validate/${id}`);

    return response.data.message
}

export const deleteReservationByAdmin = async (formData) => {
    const response = await AxiosClient.post(`reservation/deleteadmin/${formData.id}`, formData);

    return response.data.message
}

export const getCommande = async () => {
    const response = await AxiosClient.get(`commande/all`);

    return response.data.commandes
}

export const validateCommandes = async (id) => {
    const response = await AxiosClient.post(`commande/validate/${id}`);

    return response.data.message
}

export const deleteCommandes = async (formData) => {
    const response = await AxiosClient.post(`commande/delete/${formData.id}`, formData);

    return response.data.message
}

export const getCountNotification = async () => {
    const response = await AxiosClient.get(`notification/count`);

    return response.data.count
}

export const getNotification = async () => {
    const response = await AxiosClient.get(`notification/all`);

    return response.data.notification
}

export const makeNotificationSeen = async (id) => {
    const response = await AxiosClient.post(`notification/${id}`);

    return response.data.message
}