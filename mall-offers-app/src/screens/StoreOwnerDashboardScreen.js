import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const StoreOwnerDashboardScreen = () => {
    const { user, logout } = useAuth();
    const { getStoresByOwner, getOffersByStore, addOffer, updateOffer, deleteOffer, registerStore, categories } = useData();
    const [activeTab, setActiveTab] = useState('offers');
    const [showAddOffer, setShowAddOffer] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [offerTitle, setOfferTitle] = useState('');
    const [offerDesc, setOfferDesc] = useState('');
    const [offerDiscount, setOfferDiscount] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [offerExpiry, setOfferExpiry] = useState('');
    const [offerCategory, setOfferCategory] = useState('Fashion');
    const [offerIsOnline, setOfferIsOnline] = useState(false);
    const [storeName, setStoreName] = useState('');
    const [storeLocation, setStoreLocation] = useState('');
    const [storeCategory, setStoreCategory] = useState('Fashion');

    if (isLoading || !user) {
        return (
            <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={StyleSheet.absoluteFill} />
                <Text style={{ color: '#fff', fontSize: 18 }}>Loading Dashboard...</Text>
            </View>
        );
    }

    const myStores = getStoresByOwner(user.id) || [];
    const approvedStores = myStores.filter(s => s.approved);
    const allMyOffers = myStores.flatMap(store => getOffersByStore(store.id).map(o => ({ ...o, storeName: store.storeName })));

    const resetForm = () => { setOfferTitle(''); setOfferDesc(''); setOfferDiscount(''); setOfferPrice(''); setOfferExpiry(''); setOfferCategory('Fashion'); setOfferIsOnline(false); setEditingOffer(null); };

    const handleAddOffer = () => {
        if (!offerTitle.trim() || !offerDiscount || !offerPrice) { Alert.alert('Error', 'Fill required fields'); return; }
        if (approvedStores.length === 0) { Alert.alert('Error', 'Need an approved store first'); return; }
        const data = { title: offerTitle.trim(), description: offerDesc.trim(), discount: parseInt(offerDiscount), originalPrice: parseInt(offerPrice), storeId: approvedStores[0].id, expiryDate: offerExpiry || '2026-06-30', category: offerCategory, isOnline: offerIsOnline, image: null };
        if (editingOffer) { updateOffer(editingOffer.id, data); Alert.alert('Success', 'Offer updated'); }
        else { addOffer(data); Alert.alert('Success', 'Offer added'); }
        resetForm(); setShowAddOffer(false);
    };

    const handleEditOffer = (offer) => {
        setOfferTitle(offer.title); setOfferDesc(offer.description); setOfferDiscount(String(offer.discount));
        setOfferPrice(String(offer.originalPrice)); setOfferExpiry(offer.expiryDate); setOfferCategory(offer.category);
        setOfferIsOnline(offer.isOnline); setEditingOffer(offer); setShowAddOffer(true);
    };

    const handleDeleteOffer = (id) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this offer?')) {
                deleteOffer(id);
            }
        } else {
            Alert.alert('Delete?', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteOffer(id) }]);
        }
    };

    const handleAddStore = () => {
        if (!storeName.trim() || !storeLocation.trim()) { Alert.alert('Error', 'Fill all fields'); return; }
        registerStore(storeName.trim(), user.id, storeLocation.trim(), storeCategory);
        Alert.alert('Success', 'Store submitted for approval'); setStoreName(''); setStoreLocation(''); setShowAddStore(false);
    };

    return (
        <View style={s.container}>
            <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={s.gradient}>
                <View style={s.header}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={s.headerTitle}>Store Dashboard</Text>
                            <Text style={s.headerSub}>Manage your stores & offers</Text>
                        </View>
                        <TouchableOpacity
                            style={s.headerLogout}
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
                </View>
                <View style={s.statsRow}>
                    {[{ v: myStores.length, l: 'Stores' }, { v: allMyOffers.length, l: 'Offers' }, { v: approvedStores.length, l: 'Approved' }].map((st, i) => (
                        <View key={i} style={s.statCard}><Text style={s.statVal}>{st.v}</Text><Text style={s.statLbl}>{st.l}</Text></View>
                    ))}
                </View>
                <View style={s.tabRow}>
                    {['offers', 'stores'].map(t => (
                        <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabAct]} onPress={() => setActiveTab(t)}>
                            <Text style={[s.tabTxt, activeTab === t && s.tabTxtAct]}>{t === 'offers' ? 'Offers' : 'My Stores'}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={s.addBtn} onPress={() => activeTab === 'offers' ? (resetForm(), setShowAddOffer(true)) : setShowAddStore(true)}>
                    <LinearGradient colors={activeTab === 'offers' ? ['#FF6B6B', '#FF8E53'] : ['#4ECDC4', '#44B39D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.addBtnG}>
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                        <Text style={s.addBtnTxt}>{activeTab === 'offers' ? 'Add New Offer' : 'Register Store'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
                {activeTab === 'offers' ? (
                    <FlatList data={allMyOffers} keyExtractor={i => i.id} contentContainerStyle={s.list} showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={s.card}>
                                <View style={s.cardTop}>
                                    <View style={{ flex: 1 }}><Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text><Text style={s.cardSub}>{item.storeName}</Text></View>
                                    <View style={s.discBadge}><Text style={s.discTxt}>{item.discount}% OFF</Text></View>
                                </View>
                                <View style={s.cardBot}>
                                    <Text style={s.expTxt}>Expires: {new Date(item.expiryDate).toLocaleDateString()}</Text>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TouchableOpacity style={s.editB} onPress={() => handleEditOffer(item)}><Ionicons name="create-outline" size={18} color="#4ECDC4" /></TouchableOpacity>
                                        <TouchableOpacity style={s.delB} onPress={() => handleDeleteOffer(item.id)}><Ionicons name="trash-outline" size={18} color="#FF6B6B" /></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={<View style={s.empty}><Ionicons name="pricetags-outline" size={48} color="#4A4A5A" /><Text style={s.emptyTxt}>No offers yet</Text></View>}
                    />
                ) : (
                    <FlatList data={myStores} keyExtractor={i => i.id} contentContainerStyle={s.list} showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={s.card}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={s.storeIc}><Ionicons name="storefront" size={20} color="#FF8E53" /></View>
                                        <View><Text style={s.cardTitle}>{item.storeName}</Text><Text style={s.cardSub}>{item.location}</Text></View>
                                    </View>
                                    <View style={[s.statusB, { backgroundColor: item.approved ? 'rgba(78,205,196,0.15)' : 'rgba(255,142,83,0.15)' }]}>
                                        <Text style={{ color: item.approved ? '#4ECDC4' : '#FF8E53', fontSize: 12, fontWeight: '700' }}>{item.approved ? 'Approved' : 'Pending'}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={<View style={s.empty}><Ionicons name="storefront-outline" size={48} color="#4A4A5A" /><Text style={s.emptyTxt}>No stores</Text></View>}
                    />
                )}
                {/* Add Offer Modal */}
                <Modal visible={showAddOffer} animationType="slide" transparent>
                    <View style={s.modalOv}><View style={s.modalC}><LinearGradient colors={['#1a1a2e', '#16213e']} style={s.modalG}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={s.modalH}><Text style={s.modalT}>{editingOffer ? 'Edit Offer' : 'Add Offer'}</Text><TouchableOpacity onPress={() => setShowAddOffer(false)}><Ionicons name="close-circle" size={28} color="#8E8E93" /></TouchableOpacity></View>
                            <TextInput style={s.mInput} placeholder="Title *" placeholderTextColor="#8E8E93" value={offerTitle} onChangeText={setOfferTitle} />
                            <TextInput style={[s.mInput, { minHeight: 80, textAlignVertical: 'top' }]} placeholder="Description" placeholderTextColor="#8E8E93" value={offerDesc} onChangeText={setOfferDesc} multiline />
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TextInput style={[s.mInput, { flex: 1 }]} placeholder="Discount %" placeholderTextColor="#8E8E93" value={offerDiscount} onChangeText={setOfferDiscount} keyboardType="numeric" />
                                <TextInput style={[s.mInput, { flex: 1 }]} placeholder="Price ₹" placeholderTextColor="#8E8E93" value={offerPrice} onChangeText={setOfferPrice} keyboardType="numeric" />
                            </View>
                            <TextInput style={s.mInput} placeholder="Expiry (YYYY-MM-DD)" placeholderTextColor="#8E8E93" value={offerExpiry} onChangeText={setOfferExpiry} />
                            <Text style={s.mLabel}>Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                                {categories.filter(c => c !== 'All').map(c => <TouchableOpacity key={c} style={[s.chip, offerCategory === c && s.chipA]} onPress={() => setOfferCategory(c)}><Text style={[s.chipT, offerCategory === c && s.chipTA]}>{c}</Text></TouchableOpacity>)}
                            </View></ScrollView>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }} onPress={() => setOfferIsOnline(!offerIsOnline)}>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Available Online</Text>
                                <Ionicons name={offerIsOnline ? 'toggle' : 'toggle-outline'} size={36} color={offerIsOnline ? '#4ECDC4' : '#8E8E93'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={s.mSubmit} onPress={handleAddOffer}><LinearGradient colors={['#FF6B6B', '#FF8E53']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.mSubmitG}><Text style={s.mSubmitT}>{editingOffer ? 'Update' : 'Add Offer'}</Text></LinearGradient></TouchableOpacity>
                        </ScrollView>
                    </LinearGradient></View></View>
                </Modal>
                {/* Add Store Modal */}
                <Modal visible={showAddStore} animationType="slide" transparent>
                    <View style={s.modalOv}><View style={s.modalC}><LinearGradient colors={['#1a1a2e', '#16213e']} style={s.modalG}>
                        <View style={s.modalH}><Text style={s.modalT}>Register Store</Text><TouchableOpacity onPress={() => setShowAddStore(false)}><Ionicons name="close-circle" size={28} color="#8E8E93" /></TouchableOpacity></View>
                        <TextInput style={s.mInput} placeholder="Store Name *" placeholderTextColor="#8E8E93" value={storeName} onChangeText={setStoreName} />
                        <TextInput style={s.mInput} placeholder="Location *" placeholderTextColor="#8E8E93" value={storeLocation} onChangeText={setStoreLocation} />
                        <Text style={s.mLabel}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                            {categories.filter(c => c !== 'All').map(c => <TouchableOpacity key={c} style={[s.chip, storeCategory === c && s.chipA]} onPress={() => setStoreCategory(c)}><Text style={[s.chipT, storeCategory === c && s.chipTA]}>{c}</Text></TouchableOpacity>)}
                        </View></ScrollView>
                        <TouchableOpacity style={s.mSubmit} onPress={handleAddStore}><LinearGradient colors={['#4ECDC4', '#44B39D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.mSubmitG}><Text style={s.mSubmitT}>Submit for Approval</Text></LinearGradient></TouchableOpacity>
                    </LinearGradient></View></View>
                </Modal>
            </LinearGradient>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1 }, gradient: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
    headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' }, headerSub: { color: '#A0A0B0', fontSize: 14, marginTop: 2 },
    headerLogout: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,107,107,0.15)', alignItems: 'center', justifyContent: 'center' },
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 12 },
    statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    statVal: { color: '#FF8E53', fontSize: 24, fontWeight: '900' }, statLbl: { color: '#8E8E93', fontSize: 12, marginTop: 4 },
    tabRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 }, tabAct: { backgroundColor: '#FF6B6B' },
    tabTxt: { color: '#8E8E93', fontSize: 14, fontWeight: '600' }, tabTxtAct: { color: '#fff' },
    addBtn: { marginHorizontal: 20, marginTop: 16, borderRadius: 14, overflow: 'hidden' },
    addBtnG: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 14 },
    addBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
    list: { padding: 20, paddingBottom: 100 },
    card: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' }, cardSub: { color: '#A0A0B0', fontSize: 12, marginTop: 2 },
    discBadge: { backgroundColor: 'rgba(255,107,107,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    discTxt: { color: '#FF6B6B', fontSize: 12, fontWeight: '700' },
    cardBot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    expTxt: { color: '#8E8E93', fontSize: 12 },
    editB: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(78,205,196,0.15)', alignItems: 'center', justifyContent: 'center' },
    delB: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,107,107,0.15)', alignItems: 'center', justifyContent: 'center' },
    storeIc: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,142,83,0.15)', alignItems: 'center', justifyContent: 'center' },
    statusB: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    empty: { alignItems: 'center', paddingTop: 40 }, emptyTxt: { color: '#8E8E93', fontSize: 16, marginTop: 12 },
    modalOv: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalC: { maxHeight: '85%', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
    modalG: { padding: 24, paddingBottom: 40 },
    modalH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalT: { color: '#fff', fontSize: 22, fontWeight: '800' },
    mInput: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    mLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 4 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    chipA: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' }, chipT: { color: '#8E8E93', fontSize: 13, fontWeight: '600' }, chipTA: { color: '#fff' },
    mSubmit: { borderRadius: 14, overflow: 'hidden', marginTop: 10 },
    mSubmitG: { paddingVertical: 15, alignItems: 'center', borderRadius: 14 }, mSubmitT: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default StoreOwnerDashboardScreen;
