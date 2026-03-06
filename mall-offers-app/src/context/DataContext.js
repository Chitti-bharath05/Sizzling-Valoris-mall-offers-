import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // --- Data Fetching with React Query ---

    const {
        data: stores = [],
        isLoading: isLoadingStores,
        refetch: refetchStores
    } = useQuery({
        queryKey: ['stores'],
        queryFn: () => apiClient.get('/stores'),
    });

    const {
        data: offers = [],
        isLoading: isLoadingOffers,
        refetch: refetchOffers
    } = useQuery({
        queryKey: ['offers'],
        queryFn: () => apiClient.get('/offers'),
    });

    const {
        data: categories = [],
        isLoading: isLoadingCategories
    } = useQuery({
        queryKey: ['categories'],
        queryFn: () => apiClient.get('/categories'),
    });

    // Mocking orders for now as they are usually user-specific and dynamic
    const [orders, setOrders] = useState([]);

    // ---- Store operations ----
    const registerStore = async (storeName, ownerId, location, category) => {
        // In a real app, this would be an API call
        console.log('Registering store:', { storeName, ownerId, location, category });
        refetchStores();
    };

    const approveStore = async (storeId) => {
        // API call to approve
        refetchStores();
    };

    const rejectStore = async (storeId) => {
        // API call to reject
        refetchStores();
    };

    const getStoresByOwner = (ownerId) => {
        return stores.filter((s) => s.ownerId === ownerId);
    };

    const getApprovedStores = () => {
        return stores.filter((s) => s.approved);
    };

    const getPendingStores = () => {
        return stores.filter((s) => !s.approved);
    };

    const getStoreById = (storeId) => {
        return stores.find((s) => s.id === storeId);
    };

    // ---- Offer operations ----
    const addOffer = async (offerData) => {
        // API call to add
        refetchOffers();
    };

    const updateOffer = async (offerId, updates) => {
        // API call to update
        refetchOffers();
    };

    const deleteOffer = async (offerId) => {
        // API call to delete
        refetchOffers();
    };

    const getOffersByStore = (storeId) => {
        return offers.filter((o) => o.storeId === storeId);
    };

    const getActiveOffers = () => {
        const now = new Date().toISOString().split('T')[0];
        return offers.filter((o) => {
            const store = stores.find((s) => s.id === o.storeId);
            return store && store.approved && o.expiryDate >= now;
        });
    };

    const getOfferById = (offerId) => {
        return offers.find((o) => o.id === offerId);
    };

    // ---- Order operations ----
    const placeOrder = (userId, items, totalAmount) => {
        const newOrder = {
            id: 'ord' + Date.now(),
            userId,
            items,
            totalAmount,
            paymentStatus: 'completed',
            orderDate: new Date().toISOString().split('T')[0],
        };
        setOrders((prev) => [...prev, newOrder]);
        return newOrder;
    };

    const getOrdersByUser = (userId) => {
        return orders.filter((o) => o.userId === userId);
    };

    return (
        <DataContext.Provider
            value={{
                stores,
                offers,
                categories,
                orders,
                isLoading: isLoadingStores || isLoadingOffers || isLoadingCategories,
                registerStore,
                approveStore,
                rejectStore,
                getStoresByOwner,
                getApprovedStores,
                getPendingStores,
                getStoreById,
                addOffer,
                updateOffer,
                deleteOffer,
                getOffersByStore,
                getActiveOffers,
                getOfferById,
                placeOrder,
                getOrdersByUser,
                refetchStores,
                refetchOffers
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
