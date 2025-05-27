import axios from "axios";

const AxiosClient = axios.create({
    baseURL: `http://127.0.0.1:8000/api`,
    withCredentials: true
})

AxiosClient.interceptors.request.use((config) => {
    const Token = localStorage.getItem('ACCESS_TOKEN')

    config.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        Authorization: `Bearer ${Token}`,
        "Content-Type": 'multipart/form-data'
    }

    return config
});


AxiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    const {response} = error

    if (response.status === 401) {
        // ereur lier a l'authentification, si le token n'est pas valide
        localStorage.removeItem('ACCESS_TOKEN')
        return response
    }  else {
        return response;
    }
})

export default AxiosClient;