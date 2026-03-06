import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    TextInput,
    ScrollView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

export default function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { offers, categories, isLoading, getActiveOffers, getStoreById } = useData();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const activeOffers = getActiveOffers() || [];

    const filteredOffers = useMemo(() => {
        let filtered = activeOffers;
        if (selectedCategory !== 'All') {
            filtered = filtered.filter((o) => o?.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (o) =>
                    o?.title?.toLowerCase().includes(q) ||
                    o?.description?.toLowerCase().includes(q)
            );
        }
        return filtered;
    }, [activeOffers, selectedCategory, searchQuery]);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={StyleSheet.absoluteFill} />
                <Text style={{ color: '#fff', fontSize: 18 }}>Loading Offers...</Text>
            </View>
        );
    }

    const getCategoryIcon = (cat) => {
        const icons = {
            All: 'grid-outline',
            Fashion: 'shirt-outline',
            Electronics: 'phone-portrait-outline',
            Food: 'fast-food-outline',
            Beauty: 'sparkles-outline',
            Sports: 'fitness-outline',
            Home: 'home-outline',
        };
        return icons[cat] || 'pricetag-outline';
    };

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
        const store = getStoreById(item.storeId);
        const originalPrice = item.originalPrice || 0;
        const discount = item.discount || 0;
        const discountedPrice = Math.round(
            originalPrice * (1 - discount / 100)
        );
        const gradientColors = getOfferColor(index);

        return (
            <TouchableOpacity
                style={styles.offerCard}
                onPress={() => navigation.navigate('OfferDetails', { offerId: item.id })}
                activeOpacity={0.85}
            >
                {/* Card Header with Gradient */}
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardHeader}
                >
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}%</Text>
                        <Text style={styles.offText}>OFF</Text>
                    </View>
                    {item.isOnline && (
                        <View style={styles.onlineBadge}>
                            <Ionicons name="globe-outline" size={10} color="#fff" />
                            <Text style={styles.onlineBadgeText}>Online</Text>
                        </View>
                    )}
                    <Ionicons
                        name={
                            item.category === 'Fashion'
                                ? 'shirt'
                                : item.category === 'Electronics'
                                    ? 'phone-portrait'
                                    : 'pricetag'
                        }
                        size={40}
                        color="rgba(255,255,255,0.3)"
                        style={styles.cardIcon}
                    />
                </LinearGradient>

                {/* Card Body */}
                <View style={styles.cardBody}>
                    <Text style={styles.offerTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.storeName} numberOfLines={1}>
                        {store?.storeName || 'Store'}
                    </Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.discountedPrice}>₹{(discountedPrice || 0).toLocaleString()}</Text>
                        <Text style={styles.originalPrice}>₹{(item?.originalPrice || 0).toLocaleString()}</Text>
                    </View>
                    <View style={styles.expiryRow}>
                        <Ionicons name="time-outline" size={12} color="#8E8E93" />
                        <Text style={styles.expiryText}>
                            Expires: {item?.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            Hello, {user?.name?.split(' ')[0] || 'there'} 👋
                        </Text>
                        <Text style={styles.subtitle}>Find the best deals today</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.headerLogout}
                        onPress={() => {
                            const doLogout = () => logout();
                            if (Platform.OS === 'web') {
                                try {
                                    if (window.confirm('Sign out?')) doLogout();
                                } catch (e) {
                                    doLogout();
                                }
                            } else {
                                Alert.alert('Sign Out', 'Are you sure?', [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Sign Out', style: 'destructive', onPress: doLogout }
                                ]);
                            }
                        }}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#8E8E93" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search offers, brands, stores..."
                        placeholderTextColor="#8E8E93"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#8E8E93" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {(categories || []).map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat && styles.categoryChipActive,
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Ionicons
                                name={getCategoryIcon(cat)}
                                size={16}
                                color={selectedCategory === cat ? '#FFFFFF' : '#A0A0B0'}
                            />
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === cat && styles.categoryTextActive,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Offers Count */}
                <View style={styles.offersHeader}>
                    <Text style={styles.offersCount}>
                        {filteredOffers.length} offers available
                    </Text>
                    <View style={styles.filterBadge}>
                        <Ionicons name="flame" size={14} color="#FF6B6B" />
                        <Text style={styles.filterBadgeText}>Hot Deals</Text>
                    </View>
                </View>

                {/* Offers Grid */}
                <FlatList
                    data={filteredOffers}
                    renderItem={renderOfferCard}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.offersGrid}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search" size={60} color="#4A4A5A" />
                            <Text style={styles.emptyText}>No offers found</Text>
                            <Text style={styles.emptySubtext}>
                                Try adjusting your search or filters
                            </Text>
                        </View>
                    }
                />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 12,
    },
    headerLogout: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,107,107,0.15)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 14,
        color: '#A0A0B0',
        marginTop: 2,
    },
    profileBtn: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginHorizontal: 20,
        marginTop: 8,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 10,
    },
    categoriesContainer: {
        marginTop: 16,
        maxHeight: 44,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        marginRight: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    categoryChipActive: {
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
    },
    categoryText: {
        color: '#A0A0B0',
        fontSize: 13,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    offersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    offersCount: {
        color: '#A0A0B0',
        fontSize: 14,
        fontWeight: '600',
    },
    filterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    filterBadgeText: {
        color: '#FF6B6B',
        fontSize: 13,
        fontWeight: '600',
    },
    offersGrid: {
        paddingHorizontal: 12,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-evenly',
        marginBottom: 14,
    },
    offerCard: {
        width: CARD_WIDTH,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    cardHeader: {
        height: 100,
        padding: 12,
        justifyContent: 'space-between',
    },
    discountBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    offText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    onlineBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    onlineBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '600',
    },
    cardIcon: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    cardBody: {
        padding: 12,
    },
    offerTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
        marginBottom: 4,
    },
    storeName: {
        color: '#A0A0B0',
        fontSize: 12,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    discountedPrice: {
        color: '#4ECDC4',
        fontSize: 16,
        fontWeight: '800',
    },
    originalPrice: {
        color: '#6E6E7E',
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    expiryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    expiryText: {
        color: '#8E8E93',
        fontSize: 11,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },
    emptySubtext: {
        color: '#8E8E93',
        fontSize: 14,
        marginTop: 6,
    },
});
