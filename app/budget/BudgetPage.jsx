import {
	StyleSheet,
	SafeAreaView,
	Button,
	TextInput,
	ScrollView,
} from 'react-native';
import { View, Text } from 'react-native';
import { useState } from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Budget from '../../components/Budget';
import BudgetForm from '../../components/BudgetForm';
import ExpenseForm from '../../components/ExpenseForm';

export default function BudgetPage() {
	const [budgets, setBudgets] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [expenseFormOpen, setExpenseFormOpen] = useState(false); // For expense form
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(
		new Date(new Date().setDate(new Date().getDate() + 5)),
	);
	const [error, setError] = useState('');
	const [currentBudgetId, setCurrentBudgetId] = useState(null);
	const [expenseName, setExpenseName] = useState(''); // Expense fields
	const [expenseAmount, setExpenseAmount] = useState('');

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
				getBudgets();
			}
		} catch (err) {}
	};

	const updateBudget = async () => {
		if (!name || !amount) {
			setError('All fields are required.');
			return;
		}

		try {
			const token = await getToken();
			const response = await fetch(
				`http://192.168.1.96:5001/api/budget/${currentBudgetId}`,
				{
					method: 'PUT',
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
				},
			);

			if (response.ok) {
				setName('');
				setAmount('');
				setStartDate(new Date());
				setEndDate(new Date(new Date().setDate(new Date().getDate() + 5)));
				setCurrentBudgetId(null);
				getBudgets();
				setFormOpen(false);
			}
		} catch (err) {}
	};

	const deleteBudget = async (budgetID) => {
		try {
			const token = await getToken();

			const response = await fetch(
				`http://192.168.1.96:5001/api/budget/${budgetID}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: token,
					},
				},
			);

			if (response.ok) {
				const data = await response.json();
				console.log(data.message);
				getBudgets();
			} else {
				const errorData = await response.json();
				console.error(errorData.message);
			}
		} catch (err) {
			console.error('Error deleting budget: ', err);
		}
	};

	const handleEditClick = (budget) => {
		setName(budget.name);
		setAmount(budget.amount.toString());
		setStartDate(new Date(budget.startDate));
		setEndDate(new Date(budget.endDate));
		setCurrentBudgetId(budget._id);
		setFormOpen(true);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{budgets && budgets.length > 0 ? (
					<View>
						<Text style={styles.title}>Here are your budgets</Text>
						{budgets.map((budget) => (
							<Budget
								key={budget._id}
								budget={budget}
								deleteBudget={deleteBudget}
								handleEditClick={handleEditClick}
								expenseFormOpen={expenseFormOpen}
								setExpenseFormOpen={setExpenseFormOpen}
								setCurrentBudgetId={setCurrentBudgetId}
								getToken={getToken}
							/>
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
					<BudgetForm
						name={name}
						setName={setName}
						amount={amount}
						setAmount={setAmount}
						startDate={startDate}
						handleStartDateChange={handleStartDateChange}
						endDate={endDate}
						handleEndDateChange={handleEndDateChange}
						onSubmit={currentBudgetId ? updateBudget : createBudget}
						onClose={() => setFormOpen(false)}
						currentBudgetId={currentBudgetId}
					/>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f0f0f0',
		flex: 1,
	},
	scrollContainer: {
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},

	budgetDate: {
		fontSize: 14,
		color: '#888',
	},
	noBudgetText: {
		color: '#888',
		textAlign: 'center',
		fontSize: 16,
	},

	form: {
		marginTop: 20,
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	input: {
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
	},
	label: {
		marginTop: 10,
		fontSize: 14,
		color: '#666',
	},
});
