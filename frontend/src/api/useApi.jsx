import axios from "axios";
import { useMemo } from "react";

const useApi = () => {
    const token = localStorage.getItem("accessToken")
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL : import.meta.env.VITE_API_BASE_URL
        })
        instance.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config;
            },
            (error) => Promise.reject(error)

        )
        return instance;
    }, [token])
    return api
}

export default useApi;