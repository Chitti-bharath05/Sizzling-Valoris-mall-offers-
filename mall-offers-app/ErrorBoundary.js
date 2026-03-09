import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.header}>Oops! Something went wrong.</Text>
                    <ScrollView style={styles.scroll}>
                        <Text style={styles.errorText}>
                            {this.state.error && this.state.error.toString()}
                        </Text>
                        <Text style={styles.stackText}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </Text>
                    </ScrollView>
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'blue',
        marginTop: 40,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 10,
    },
    scroll: {
        flex: 1,
    },
    errorText: {
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stackText: {
        color: 'gray',
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;
