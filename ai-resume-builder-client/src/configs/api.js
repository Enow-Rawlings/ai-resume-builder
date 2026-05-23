import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : window.location.origin)

const api = axios.create({
  baseURL
})

export default api