import { StyleSheet, SafeAreaView, Button } from 'react-native';
import { TextInput, View, Text } from 'react-native';
import { useState } from 'react';

export default function SignUp() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignUp = () => {
		if (!firstName || !lastName || !email || !password) {
			// show empty inputs error
			return;
		}

		// handle sign up here
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
			<Button
				title="Sign Up"
				color={'black'}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0a7ea4',
		flex: '1',
		padding: '10',
	},
	input: {
		padding: '10',
	},
});
