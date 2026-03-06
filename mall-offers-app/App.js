import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { DataProvider } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './ErrorBoundary';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <ErrorBoundary>
              <AppNavigator />
            </ErrorBoundary>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
