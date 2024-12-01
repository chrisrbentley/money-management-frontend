import {
	StyleSheet,
	SafeAreaView,
	Button,
	TextInput,
	View,
	Text,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SignUp() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const router = useRouter();

	const handleSignUp = async () => {
		setError('');

		if (!firstName || !lastName || !email || !password) {
			setError('All fields are required.');
			return;
		}

		// handle sign up here
		try {
			const response = await fetch(
				'http://192.168.1.96:5001/api/auth/register',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ firstName, lastName, email, password }),
				},
			);

			if (response.ok) {
				setError(''); // clear any errors
				router.push('auth/login');
			} else {
				setError('Failed to register.');
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
					placeholder="First Name"
					value={firstName}
					onChangeText={(text) => setFirstName(text)}
					style={styles.input}
					placeholderTextColor="#bbb"
				/>
				<TextInput
					placeholder="Last Name"
					value={lastName}
					onChangeText={(text) => setLastName(text)}
					style={styles.input}
					placeholderTextColor="#bbb"
				/>
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
					autoCapitalize="none"
					secureTextEntry
					placeholderTextColor="#bbb"
				/>
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			<Button
				title="Sign Up"
				color="#0a7ea4"
				onPress={handleSignUp}
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
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginBottom: 15,
	},
});
