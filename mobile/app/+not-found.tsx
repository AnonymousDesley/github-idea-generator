import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={styles.container}>
                <Text style={styles.title}>404: ROUTE_NOT_FOUND</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>RETURN_TO_BASE</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Courier',
        marginBottom: 20,
    },
    link: {
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
        fontFamily: 'Courier',
        textDecorationLine: 'underline',
    },
});
