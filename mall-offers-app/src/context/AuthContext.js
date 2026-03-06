import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
        fetchUsers();
    }, []);

    const loadUser = async () => {
        try {
            const stored = await AsyncStorage.getItem('currentUser');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) {
            console.log('Error loading user:', e);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/auth/users');
            if (Array.isArray(response)) {
                setUsers(response);
            }
        } catch (e) {
            console.log('Error fetching users:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            if (response.success) {
                setUser(response.user);
                await AsyncStorage.setItem('currentUser', JSON.stringify(response.user));
                return { success: true, user: response.user };
            }
            return { success: false, message: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, message: error.message || 'An error occurred during login' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await apiClient.post('/auth/register', { name, email, password, role });
            if (response.success) {
                setUser(response.user);
                await AsyncStorage.setItem('currentUser', JSON.stringify(response.user));
                return { success: true, user: response.user };
            }
            return { success: false, message: response.message || 'Registration failed' };
        } catch (error) {
            return { success: false, message: error.message || 'An error occurred during registration' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            setUser(null);
        } catch (e) {
            console.error('Logout error:', e);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                users,
                isLoading,
                login,
                register,
                logout,
                fetchUsers,
                deleteUser: (id) => setUsers(prev => prev.filter(u => u.id !== id)),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
