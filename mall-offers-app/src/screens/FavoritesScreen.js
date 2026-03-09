import React, { useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

export default function FavoritesScreen({ navigation }) {
    const { favorites, toggleFavorite } = useAuth();
    const { offers, getStoreById } = useData();

    const favoriteOffers = useMemo(() => {
        return offers.filter(o => favorites.includes(o._id || o.id));
    }, [offers, favorites]);

    const getOfferColor = (index) => {
        const colors = [
            ['#FF6B6B', '#FF8E53'],
            ['#4ECDC4', '#44B39D'],
            ['#A18CD1', '#FBC2EB'],
            ['#667EEA', '#764BA2'],
            ['#F093FB', '#F5576C'],
            ['#4FACFE', '#00F2FE'],
        ];
        return colors[index % colors.length];
    };

    const renderOfferCard = ({ item, index }) => {
        const store = item.storeId; // storeId is populated object from backend
        const originalPrice = item.originalPrice || 0;
        const discount = item.discount || 0;
        const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
        const gradientColors = getOfferColor(index);

        return (
            <TouchableOpacity
                style={styles.offerCard}
                onPress={() => navigation.navigate('OfferDetails', { offerId: item._id || item.id })}
                activeOpacity={0.85}
            >
                <View style={styles.cardHeaderWrapper}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                    ) : (
                        <LinearGradient
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardHeader}
                        >
                            <Ionicons
                                name={item.category === 'Fashion' ? 'shirt' : item.category === 'Electronics' ? 'phone-portrait' : 'pricetag'}
                                size={40}
                                color="rgba(255,255,255,0.3)"
                                style={styles.cardIcon}
                            />
                        </LinearGradient>
                    )}

                    <TouchableOpacity 
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(item._id || item.id)}
                    >
                        <Ionicons name="heart" size={20} color="#FF6B6B" />
                    </TouchableOpacity>

                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}%</Text>
                        <Text style={styles.offText}>OFF</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.offerTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.storeMiniRow}>
                        {store?.logoUrl ? (
                            <Image source={{ uri: store.logoUrl }} style={styles.miniStoreLogo} />
                        ) : (
                            <Ionicons name="storefront" size={12} color="#8E8E93" style={{ marginRight: 4 }} />
                        )}
                        <Text style={styles.storeName} numberOfLines={1}>{store?.storeName || 'Store'}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.discountedPrice}>₹{(discountedPrice || 0).toLocaleString()}</Text>
                        <Text style={styles.originalPrice}>₹{(item?.originalPrice || 0).toLocaleString()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Favorites</Text>
                    <Text style={styles.headerSub}>{favoriteOffers.length} Saved Offers</Text>
                </View>

                <FlatList
                    data={favoriteOffers}
                    renderItem={renderOfferCard}
                    keyExtractor={(item) => item._id || item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={Platform.OS !== 'web'}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="heart-dislike-outline" size={60} color="#4A4A5A" />
                            <Text style={styles.emptyText}>No favorites yet</Text>
                            <Text style={styles.emptySubtext}>Tap the heart on any offer to save it here!</Text>
                            <TouchableOpacity 
                                style={styles.browseBtn}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Text style={styles.browseBtnText}>Browse Offers</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
    headerSub: { fontSize: 14, color: '#A0A0B0', marginTop: 4 },
    listContent: { paddingHorizontal: 12, paddingBottom: 100 },
    columnWrapper: { justifyContent: 'space-evenly', marginBottom: 14 },
    offerCard: {
        width: CARD_WIDTH,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    cardHeaderWrapper: { height: 100, position: 'relative' },
    cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardHeader: { height: 100, padding: 12, justifyContent: 'center', alignItems: 'center' },
    favoriteButton: {
        position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    discountBadge: {
        position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'baseline', gap: 2,
    },
    discountText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
    offText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
    cardIcon: { position: 'absolute', bottom: 8, right: 8 },
    cardBody: { padding: 12 },
    offerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', lineHeight: 18, marginBottom: 4 },
    storeName: { color: '#A0A0B0', fontSize: 12 },
    storeMiniRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    miniStoreLogo: { width: 14, height: 14, borderRadius: 3, marginRight: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    discountedPrice: { color: '#4ECDC4', fontSize: 16, fontWeight: '800' },
    originalPrice: { color: '#6E6E7E', fontSize: 12, textDecorationLine: 'line-through' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 40 },
    emptyText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 16 },
    emptySubtext: { color: '#A0A0B0', fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
    browseBtn: { marginTop: 24, backgroundColor: '#FF6B6B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    browseBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
