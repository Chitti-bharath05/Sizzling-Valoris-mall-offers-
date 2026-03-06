import React, { createContext, useState, useContext } from 'react';
import { STORES, OFFERS, ORDERS } from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [stores, setStores] = useState(STORES);
    const [offers, setOffers] = useState(OFFERS);
    const [orders, setOrders] = useState(ORDERS);

    // ---- Store operations ----
    const registerStore = (storeName, ownerId, location, category) => {
        const newStore = {
            id: 's' + Date.now(),
            storeName,
            ownerId,
            location,
            approved: false,
            category,
        };
        setStores((prev) => [...prev, newStore]);
        return newStore;
    };

    const approveStore = (storeId) => {
        setStores((prev) =>
            prev.map((s) => (s.id === storeId ? { ...s, approved: true } : s))
        );
    };

    const rejectStore = (storeId) => {
        setStores((prev) => prev.filter((s) => s.id !== storeId));
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
    const addOffer = (offerData) => {
        const newOffer = {
            id: 'o' + Date.now(),
            ...offerData,
        };
        setOffers((prev) => [...prev, newOffer]);
        return newOffer;
    };

    const updateOffer = (offerId, updates) => {
        setOffers((prev) =>
            prev.map((o) => (o.id === offerId ? { ...o, ...updates } : o))
        );
    };

    const deleteOffer = (offerId) => {
        setOffers((prev) => prev.filter((o) => o.id !== offerId));
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
                orders,
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
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
