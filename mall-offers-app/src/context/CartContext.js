import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            clearCart();
        }
    }, [user]);

    const addToCart = (offer) => {
        setCartItems((prev) => {
            const offerId = offer._id || offer.id;
            const existing = prev.find((item) => item.offerId === offerId);
            if (existing) {
                return prev.map((item) =>
                    item.offerId === offerId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            const discountedPrice = Math.round(
                offer.originalPrice * (1 - offer.discount / 100)
            );
            return [
                ...prev,
                {
                    offerId: offerId,
                    title: offer.title,
                    price: discountedPrice,
                    originalPrice: offer.originalPrice,
                    discount: offer.discount,
                    quantity: 1,
                    storeId: offer.storeId?._id || offer.storeId,
                },
            ];
        });
    };

    const removeFromCart = (offerId) => {
        setCartItems((prev) => prev.filter((item) => item.offerId !== offerId));
    };

    const updateQuantity = (offerId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(offerId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.offerId === offerId ? { ...item, quantity } : item
            )
        );
    };

    const getTotalAmount = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const getItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                getTotalAmount,
                getItemCount,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
