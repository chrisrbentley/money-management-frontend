import { StyleSheet, Button, View, Text } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
	const [loggedIn, setLoggedIn] = useState();
	const [userData, setUserData] = useState();
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			const checkLoginStatus = async () => {
				const token = await AsyncStorage.getItem('authToken');
				console.log(token);
				setLoggedIn(!!token);

				const user = await AsyncStorage.getItem('user');
				if (user) {
					setUserData(JSON.parse(user));
				}
			};

			checkLoginStatus();
		}, []),
	);

	// Handle logout
	const handleLogout = async () => {
		await AsyncStorage.removeItem('authToken');
		setLoggedIn(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			{loggedIn ? (
				<View style={styles.loggedInContainer}>
					<Text style={styles.welcomeText}>
						Welcome Back, {userData?.firstName}
					</Text>
					<Button
						title="Budgets"
						color="black"
						onPress={() => router.push('/budget/BudgetPage')}
					/>

					<Button
						title="Log Out"
						color="black"
						onPress={handleLogout}
					/>
				</View>
			) : (
				<View style={styles.authContainer}>
					<Text style={styles.title}>Money Management App</Text>
					<Button
						title="Sign Up"
						color="black"
						onPress={() => router.push('auth/signup')}
					/>
					<Button
						title="Log In"
						color="black"
						onPress={() => router.push('auth/login')}
					/>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0a7ea4',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	authContainer: {
		alignItems: 'center',
	},
	loggedInContainer: {
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#fff',
	},
	welcomeText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#fff',
	},
});
