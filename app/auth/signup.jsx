import { StyleSheet, SafeAreaView, Button } from 'react-native';
import { TextInput, View, Text } from 'react-native';
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
			const response = await fetch('http://localhost:5001/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ firstName, lastName, email, password }),
			});

			// const data = await response.json();

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
			<View style={styles.flexColumn}>
				<TextInput
					placeholder="First Name"
					value={firstName}
					onChangeText={(text) => setFirstName(text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="Last Name"
					value={lastName}
					onChangeText={(text) => setLastName(text)}
					style={styles.input}
				/>
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
				/>
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			<Button
				title="Sign Up"
				color={'black'}
				onPress={handleSignUp}
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
