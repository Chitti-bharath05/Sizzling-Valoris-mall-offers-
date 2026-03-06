import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for web, and your local IP for physical devices (Android/iOS)
// You should update this to your local IP address for testing on mobile
const BASE_URL = Platform.OS === 'web'
    ? 'http://localhost:5000/api'
    : 'http://10.0.2.2:5000/api'; // Standard Android Emulator localhost redirect

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Response interceptor for easy error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        return Promise.reject({ ...error, message });
    }
);

export default apiClient;
