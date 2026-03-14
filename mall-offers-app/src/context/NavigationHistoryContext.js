import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

const NavigationHistoryContext = createContext();

export const NavigationHistoryProvider = ({ children }) => {
    const [forwardStack, setForwardStack] = useState([]);
    const navigation = useNavigation();

    // Custom back that records for forward
    const goBack = useCallback(() => {
        const state = navigation.getState();
        if (state && state.index > 0) {
            const currentRoute = state.routes[state.index];
            setForwardStack(prev => [...prev, currentRoute]);
            navigation.goBack();
        }
    }, [navigation]);

    const goForward = useCallback(() => {
        if (forwardStack.length > 0) {
            const nextRoute = forwardStack[forwardStack.length - 1];
            setForwardStack(prev => prev.slice(0, -1));
            navigation.navigate(nextRoute.name, nextRoute.params);
        }
    }, [forwardStack, navigation]);

    // Reset forward stack on any "new" navigation
    // We can't easily detect "back" vs "new" without more complex state
    // But we can expose a custom navigate function
    const navigate = useCallback((name, params) => {
        setForwardStack([]);
        navigation.navigate(name, params);
    }, [navigation]);

    return (
        <NavigationHistoryContext.Provider value={{ 
            canGoForward: forwardStack.length > 0, 
            canGoBack: navigation.canGoBack(),
            goBack, 
            goForward,
            navigate
        }}>
            {children}
        </NavigationHistoryContext.Provider>
    );
};

export const useNavHistory = () => useContext(NavigationHistoryContext);
