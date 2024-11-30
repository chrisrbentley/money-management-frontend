import { StyleSheet, SafeAreaView, Button } from 'react-native';
import { TextInput, View, Text } from 'react-native';
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
			const response = await fetch('http://localhost:5001/api/auth/login', {
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
			<View style={styles.flexColumn}>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					style={styles.input}
					secureTextEntry={true}
				/>
				{error ? <Text style={styles.error}>{error}</Text> : null}
			</View>
			<Button
				title="Log In"
				color={'black'}
				onPress={handleLogin}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0a7ea4',
		flex: 1,
		padding: 10,
	},
	input: {
		padding: '10',
	},
});
