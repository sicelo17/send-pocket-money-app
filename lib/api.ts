import axios from "axios"

export const api = axios.create({
  // i would have this baseURL in a .env file in a production app, i just put it here for demo purposes
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
