import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavHistory } from '../context/NavigationHistoryContext';
import { useRoute } from '@react-navigation/native';

const NavigationControls = () => {
    const { canGoBack, canGoForward, goBack, goForward } = useNavHistory();
    const route = useRoute();
    const isWeb = Platform.OS === 'web';

    // Logic: Only show on specific "Leaf" screens or if we are deep in a stack
    const currentRouteName = route.name;

    // Screens where we EXPLICITLY allow these controls
    const allowedScreens = ['OfferDetails', 'ProfileInfo', 'ChangePassword', 'Legal', 'HelpSupport', 'Deals'];
    
    // Screens where we EXPLICITLY block these controls (Safety net)
    const blockedScreens = ['HomeMain', 'ProfileMain', 'Dashboard', 'AdminDashboard', 'Map'];
    
    const isVisible = allowedScreens.includes(currentRouteName) && !blockedScreens.includes(currentRouteName);

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={goBack} 
                disabled={!canGoBack}
                style={[styles.btn, !canGoBack && styles.disabled]}
            >
                <Ionicons name="arrow-back-circle" size={32} color={canGoBack ? "#D4AF37" : "#333"} />
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={goForward} 
                disabled={!canGoForward}
                style={[styles.btn, !canGoForward && styles.disabled]}
            >
                <Ionicons name="arrow-forward-circle" size={32} color={canGoForward ? "#D4AF37" : "#333"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.2)',
    },
    btn: {
        padding: 2,
    },
    disabled: {
        opacity: 0.5,
    }
});

export default NavigationControls;
