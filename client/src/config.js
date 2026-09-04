const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://ankitchaudhary.onrender.com';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export default API_BASE_URL;
