import axios from 'axios';

const api = axios.create({ baseURL: process.env.NODE_ENV === 'production' ? 'https://backend.oldpersiangames.org' : 'http://localhost:8000' });
api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

export { api };
