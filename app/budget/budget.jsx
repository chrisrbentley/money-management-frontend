import { StyleSheet, SafeAreaView, Button, ScrollView } from 'react-native';
import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Budget() {
	const [budgets, setBudgets] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(
		new Date(new Date().setDate(new Date().getDate() + 5)),
	);
	const [error, setError] = useState('');

	useFocusEffect(
		useCallback(() => {
			getBudgets();
		}, []),
	);

	const handleStartDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || startDate;
		setStartDate(currentDate);
	};

	const handleEndDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || endDate;
		setEndDate(currentDate);
	};

	const getToken = async () => {
		const token = await AsyncStorage.getItem('authToken');
		const newToken = `Bearer ${token}`;
		return newToken;
	};

	const getBudgets = async () => {
		const token = await getToken();

		const response = await fetch('http://192.168.1.96:5001/api/budget', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
			},
		});

		if (response.ok) {
			const data = await response.json();
			setBudgets(data);
		} else console.error('Failed to fetch budgets');
	};

	const createBudget = async () => {
		if (!name || !amount) {
			setError('All fields are required.');
			return;
		}

		try {
			const token = await getToken();
			const response = await fetch('http://192.168.1.96:5001/api/budget', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify({
					name,
					amount: parseFloat(amount),
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				}),
			});

			if (response.ok) {
				setName('');
				setAmount('');
				setStartDate(new Date());
				setEndDate(new Date(new Date().setDate(new Date().getDate() + 5)));
				getBudgets(); // Refresh budgets
			}
		} catch (err) {}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				{budgets && budgets.length > 0 ? (
					<View>
						<Text style={styles.title}>Here are your budgets</Text>
						{budgets.map((budget) => (
							<View
								key={budget._id}
								style={styles.budgetContainer}
							>
								<Text style={styles.budgetText}>{budget.name}</Text>
								<Text style={styles.budgetText}>${budget.amount}</Text>
								<Text style={styles.budgetDate}>
									{new Date(budget.startDate).toLocaleDateString('en-US')} -{' '}
									{new Date(budget.endDate).toLocaleDateString('en-US')}
								</Text>
							</View>
						))}
					</View>
				) : (
					<Text style={styles.noBudgetText}>No Budgets</Text>
				)}
				<Button
					title={formOpen ? 'Close form' : 'Add new budget'}
					color={'black'}
					onPress={() => setFormOpen((prevState) => !prevState)}
				/>
				{formOpen && (
					<View style={styles.form}>
						<TextInput
							placeholder="Name"
							value={name}
							onChangeText={(text) => setName(text)}
							style={styles.input}
						/>
						<TextInput
							placeholder="Amount"
							value={amount}
							keyboardType="numeric"
							onChangeText={(text) => setAmount(text)}
							style={styles.input}
						/>
						<Text style={styles.label}>Start Date:</Text>
						<RNDateTimePicker
							mode="date"
							value={startDate}
							onChange={handleStartDateChange}
						/>
						<Text style={styles.label}>End Date:</Text>
						<RNDateTimePicker
							mode="date"
							value={endDate}
							onChange={handleEndDateChange}
						/>
						<Button
							title="Submit"
							color={'black'}
							onPress={createBudget}
						/>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f0f0f0',
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	budgetContainer: {
		backgroundColor: '#fff',
		padding: 15,
		marginVertical: 5,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	budgetText: {
		fontSize: 16,
		color: '#333',
	},
	budgetDate: {
		fontSize: 14,
		color: '#555',
		marginTop: 5,
	},
	noBudgetText: {
		fontSize: 18,
		color: '#666',
		marginBottom: 10,
		textAlign: 'center',
	},
	form: {
		marginTop: 20,
		width: '100%',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginVertical: 10,
		borderRadius: 5,
		backgroundColor: '#fff',
	},
	label: {
		marginTop: 10,
		fontSize: 14,
		color: '#333',
	},
});
