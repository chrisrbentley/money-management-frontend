import {
	StyleSheet,
	SafeAreaView,
	Button,
	TextInput,
	View,
	Text,
} from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const router = useRouter();

	const handleLogin = async () => {
		if (!email || !password) {
			setError('All fields are required.');
			return;
		}

		try {
			const response = await fetch('http://192.168.1.96:5001/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				await AsyncStorage.setItem('authToken', data.token);
				await AsyncStorage.setItem('user', JSON.stringify(data.user));

				console.log('Token saved:', data.token);
				setError('');
				router.push('/');
			} else {
				setError(data.message || 'Failed to login.');
			}
		} catch (err) {
			// Handle any errors
			setError('An error occurred. Please try again later.');
			console.error(err);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.form}>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					style={styles.input}
					autoCapitalize="none"
					placeholderTextColor="#bbb"
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					style={styles.input}
					secureTextEntry={true}
					autoCapitalize="none"
					placeholderTextColor="#bbb"
				/>
				{error ? <Text style={styles.errorText}>{error}</Text> : null}
			</View>

			<Button
				title="Log In"
				color="#0a7ea4"
				onPress={handleLogin}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f4f4f4',
		padding: 20,
	},
	form: {
		marginBottom: 20,
	},
	input: {
		height: 50,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: '#fff',
		fontSize: 16,
		color: '#333',
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginBottom: 15,
	},
});
