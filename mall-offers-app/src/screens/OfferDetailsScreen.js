import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import apiClient from '../services/apiClient';

const { width } = Dimensions.get('window');

const OfferDetailsScreen = ({ route, navigation }) => {
    const { offerId } = route.params;
    const { getOfferById, getStoreById } = useData();
    const { addToCart } = useCart();

    const offer = getOfferById(offerId);
    const store = offer?.storeId; // storeId is populated object


    useEffect(() => {
        if (offerId) {
            apiClient.post(`/offers/${offerId}/view`).catch(err => console.log('View track error:', err));
        }
    }, [offerId]);

    if (!offer) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient}>
                    <Text style={styles.errorText}>Offer not found</Text>
                </LinearGradient>
            </View>
        );
    }

    const discountedPrice = Math.round(
        offer.originalPrice * (1 - offer.discount / 100)
    );
    const savings = offer.originalPrice - discountedPrice;

    const handleAddToCart = () => {
        addToCart(offer);
        Alert.alert('Added to Cart', `${offer.title} has been added to your cart!`, [
            { text: 'Continue Shopping', style: 'cancel' },
            { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
        ]);
    };

    const daysLeft = Math.ceil(
        (new Date(offer.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Offer Details</Text>
                    <TouchableOpacity style={styles.shareBtn}>
                        <Ionicons name="share-outline" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {offer.image ? (
                        <Image source={{ uri: offer.image }} style={styles.heroImage} />
                    ) : (
                        <LinearGradient
                            colors={
                                offer.category === 'Fashion'
                                    ? ['#FF6B6B', '#FF8E53']
                                    : offer.category === 'Electronics'
                                        ? ['#667EEA', '#764BA2']
                                        : ['#4ECDC4', '#44B39D']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroBanner}
                        >
                            <View style={styles.heroContent}>
                                <View style={styles.discountCircle}>
                                    <Text style={styles.discountBigText}>{offer.discount}%</Text>
                                    <Text style={styles.discountOffText}>OFF</Text>
                                </View>
                                <Ionicons
                                    name={
                                        offer.category === 'Fashion'
                                            ? 'shirt'
                                            : offer.category === 'Electronics'
                                                ? 'phone-portrait'
                                                : 'pricetag'
                                    }
                                    size={80}
                                    color="rgba(255,255,255,0.2)"
                                    style={styles.heroIcon}
                                />
                            </View>
                        </LinearGradient>
                    )}
                    {offer.isOnline && (
                        <View style={styles.onlineTag}>
                            <Ionicons name="globe-outline" size={14} color="#fff" />
                            <Text style={styles.onlineTagText}>Available Online</Text>
                        </View>
                    )}

                    {/* Title & Store Info */}
                    <View style={styles.titleSection}>
                        <Text style={styles.offerTitle}>{offer.title}</Text>
                        
                        <View style={styles.storeRow}>
                            <View style={styles.storeIconContainer}>
                                {store?.logoUrl ? (
                                    <Image source={{ uri: store.logoUrl }} style={styles.storeLogo} />
                                ) : (
                                    <Ionicons name="storefront" size={16} color="#FF8E53" />
                                )}
                            </View>
                            <View>
                                <Text style={styles.storeNameText}>{store?.storeName || 'Store'}</Text>
                                <Text style={styles.storeLocation}>{store?.location || ''}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Price Card */}
                    <View style={styles.priceCard}>
                        <View style={styles.priceLeft}>
                            <Text style={styles.priceLabel}>Deal Price</Text>
                            <Text style={styles.discountedPriceText}>₹{discountedPrice.toLocaleString()}</Text>
                            <Text style={styles.originalPriceText}>
                                MRP: ₹{offer.originalPrice.toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.savingsContainer}>
                            <LinearGradient
                                colors={['#4ECDC4', '#44B39D']}
                                style={styles.savingsBadge}
                            >
                                <Text style={styles.savingsText}>
                                    You save ₹{savings.toLocaleString()}
                                </Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Info Cards */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCard}>
                            <Ionicons name="time-outline" size={22} color="#FF8E53" />
                            <Text style={styles.infoCardValue}>
                                {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                            </Text>
                            <Text style={styles.infoCardLabel}>Left</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Ionicons name="pricetag-outline" size={22} color="#4ECDC4" />
                            <Text style={styles.infoCardValue}>{offer.category}</Text>
                            <Text style={styles.infoCardLabel}>Category</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Ionicons
                                name={offer.isOnline ? 'globe-outline' : 'location-outline'}
                                size={22}
                                color="#A18CD1"
                            />
                            <Text style={styles.infoCardValue}>
                                {offer.isOnline ? 'Online' : 'In-Store'}
                            </Text>
                            <Text style={styles.infoCardLabel}>Type</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>About this offer</Text>
                        <Text style={styles.descriptionText}>{offer.description}</Text>
                    </View>

                    
                    {/* Store Info Section */}
                    <View style={styles.storeInfoSection}>
                        <View style={styles.expirySectionMini}>
                            <Ionicons name="calendar-outline" size={16} color="#FF6B6B" />
                            <Text style={styles.expiryInfoText}>
                                Valid until {new Date(offer.expiryDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </Text>
                        </View>

                        <Text style={styles.sectionTitle}>About the Store</Text>
                        {store?.bannerUrl && (
                            <Image source={{ uri: store.bannerUrl }} style={styles.storeBanner} />
                        )}
                        <View style={styles.storeDetailRow}>
                             <Ionicons name="location-outline" size={16} color="#8E8E93" />
                             <Text style={styles.storeDetailText}>{store?.location || 'Location not available'}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.visitStoreBtn}
                            onPress={() => { /* Navigation to full store profile could go here */ }}
                        >
                            <Text style={styles.visitStoreText}>Visit Store Profile</Text>
                            <Ionicons name="chevron-forward" size={16} color="#FF8E53" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                <View style={styles.bottomCTA}>
                    <View style={styles.bottomPriceInfo}>
                        <Text style={styles.bottomPriceLabel}>Total Price</Text>
                        <Text style={styles.bottomPriceValue}>₹{discountedPrice.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addToCartBtn}
                        onPress={handleAddToCart}
                    >
                        <LinearGradient
                            colors={['#FF6B6B', '#FF8E53']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.addToCartGradient}
                        >
                            <Ionicons name="cart-outline" size={20} color="#fff" />
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    errorText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    shareBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    heroBanner: {
        marginHorizontal: 20,
        borderRadius: 24,
        height: 200,
        padding: 24,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    heroImage: {
        marginHorizontal: 20,
        borderRadius: 24,
        height: 320,
        width: width - 40,
        resizeMode: 'contain',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    heroContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    discountCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    discountBigText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
    },
    discountOffText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginTop: -4,
    },
    heroIcon: {
        opacity: 0.4,
    },
    onlineTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        position: 'absolute',
        top: 30,
        left: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    onlineTagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    titleSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    offerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 30,
        marginBottom: 12,
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    storeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 142, 83, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    storeLogo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    storeBanner: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginBottom: 16,
        resizeMode: 'contain',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    storeNameText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    storeLocation: {
        color: '#8E8E93',
        fontSize: 12,
    },
    priceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 18,
        padding: 18,
        marginHorizontal: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    priceLeft: {},
    priceLabel: {
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    discountedPriceText: {
        color: '#4ECDC4',
        fontSize: 28,
        fontWeight: '900',
    },
    originalPriceText: {
        color: '#6E6E7E',
        fontSize: 14,
        textDecorationLine: 'line-through',
        marginTop: 2,
    },
    savingsContainer: {
        alignItems: 'flex-end',
    },
    savingsBadge: {
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    savingsText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 16,
        gap: 10,
    },
    infoCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    infoCardValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 6,
    },
    infoCardLabel: {
        color: '#8E8E93',
        fontSize: 11,
        marginTop: 2,
    },
    descriptionSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    descriptionText: {
        color: '#B0B0C0',
        fontSize: 14,
        lineHeight: 22,
    },
    storeInfoSection: {
        paddingHorizontal: 20,
        marginTop: 32,
        paddingBottom: 40,
    },
    storeDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        marginBottom: 20,
    },
    storeDetailText: {
        color: '#8E8E93',
        fontSize: 13,
    },
    visitStoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,142,83,0.3)',
    },
    visitStoreText: {
        color: '#FF8E53',
        fontSize: 14,
        fontWeight: '700',
    },
    expirySectionMini: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
        backgroundColor: 'rgba(255,107,107,0.1)',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    expirySection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'rgba(255,107,107,0.1)',
        marginHorizontal: 20,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,107,107,0.15)',
    },
    expiryInfoText: {
        color: '#FF6B6B',
        fontSize: 13,
        fontWeight: '600',
    },
    bottomCTA: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(15, 12, 41, 0.95)',
        paddingHorizontal: 20,
        paddingVertical: 14,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    bottomPriceInfo: {},
    bottomPriceLabel: {
        color: '#8E8E93',
        fontSize: 12,
    },
    bottomPriceValue: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '800',
    },
    addToCartBtn: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    addToCartGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 16,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default OfferDetailsScreen;
