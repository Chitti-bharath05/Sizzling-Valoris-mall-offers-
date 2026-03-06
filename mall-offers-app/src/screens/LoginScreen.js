import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        const result = await login(email.trim(), password);
        setLoading(false);
        if (!result.success) {
            Alert.alert('Login Failed', result.message);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Logo Area */}
                    <View style={styles.logoContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="pricetags" size={40} color="#FF6B6B" />
                        </View>
                        <Text style={styles.appTitle}>Mall & Online</Text>
                        <Text style={styles.appSubtitle}>Offers Aggregator</Text>
                        <Text style={styles.tagline}>All deals in one place</Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.signInText}>Sign in to continue</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#8E8E93"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#8E8E93"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#8E8E93"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#FF6B6B', '#FF8E53']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.loginGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.loginButtonText}>Sign In</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.registerButtonText}>Create New Account</Text>
                        </TouchableOpacity>

                        {/* Demo Credentials */}
                        <View style={styles.demoContainer}>
                            <Text style={styles.demoTitle}>Demo Accounts</Text>
                            <Text style={styles.demoText}>Customer: customer@test.com</Text>
                            <Text style={styles.demoText}>Store Owner: store@test.com</Text>
                            <Text style={styles.demoText}>Admin: admin@test.com</Text>
                            <Text style={styles.demoText}>Password: password123</Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    appSubtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FF8E53',
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 14,
        color: '#A0A0B0',
        marginTop: 6,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    signInText: {
        fontSize: 14,
        color: '#A0A0B0',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        paddingHorizontal: 16,
        marginBottom: 14,
        height: 52,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
    },
    loginButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 8,
    },
    loginGradient: {
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 14,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    dividerText: {
        color: '#8E8E93',
        marginHorizontal: 16,
        fontSize: 12,
        fontWeight: '600',
    },
    registerButton: {
        borderWidth: 1.5,
        borderColor: '#FF6B6B',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#FF6B6B',
        fontSize: 15,
        fontWeight: '600',
    },
    demoContainer: {
        marginTop: 20,
        padding: 14,
        backgroundColor: 'rgba(255, 142, 83, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 142, 83, 0.2)',
    },
    demoTitle: {
        color: '#FF8E53',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 6,
    },
    demoText: {
        color: '#A0A0B0',
        fontSize: 12,
        lineHeight: 18,
    },
});

export default LoginScreen;
