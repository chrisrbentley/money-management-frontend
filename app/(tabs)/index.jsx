import { Image, StyleSheet, Platform, Button, View, Text } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<View>
					<Text type="title">Money Management App</Text>
				</View>
				<View>
					<Button
						title="Sign Up"
						color={'black'}
						onPress={() => {
							router.push('auth/signup');
						}}
					/>
					<Button
						title="Log In"
						color={'black'}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0a7ea4',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
