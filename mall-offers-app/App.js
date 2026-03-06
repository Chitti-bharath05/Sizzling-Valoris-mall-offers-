import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { DataProvider } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
}
