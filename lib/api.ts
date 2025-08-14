import axios from "axios"

export const api = axios.create({
  baseURL: "https://68976304250b078c2041c7fc.mockapi.io/api/wiremit",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)
