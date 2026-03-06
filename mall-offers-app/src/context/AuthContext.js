import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USERS } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(USERS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const stored = await AsyncStorage.getItem('currentUser');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) {
            console.log('Error loading user:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        const found = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
            setUser(found);
            await AsyncStorage.setItem('currentUser', JSON.stringify(found));
            return { success: true, user: found };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const register = async (name, email, password, role) => {
        const exists = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
            return { success: false, message: 'Email already registered' };
        }
        const newUser = {
            id: 'u' + Date.now(),
            name,
            email,
            password,
            role,
        };
        setUsers((prev) => [...prev, newUser]);
        setUser(newUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, user: newUser };
    };

    const logout = async () => {
        try {
            console.log('Logging out user...');
            await AsyncStorage.removeItem('currentUser');
            setUser(null);
        } catch (e) {
            console.error('Logout error:', e);
            setUser(null);
        }
    };

    const getAllUsers = () => users;

    const deleteUser = (userId) => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
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
                getAllUsers,
                deleteUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
