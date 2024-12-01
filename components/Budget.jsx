import { StyleSheet, Button } from 'react-native';
import { View, Text } from 'react-native';
import ExpenseForm from './ExpenseForm';
import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Expense from './Expense';

export default function Budget({
	budget,
	deleteBudget,
	handleEditClick,
	expenseFormOpen,
	setExpenseFormOpen,
	getToken,
}) {
	const [expenses, setExpenses] = useState([]);

	const getExpenses = async () => {
		try {
			const token = await getToken();
			const response = await fetch('http://192.168.1.96:5001/api/expenses', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			});
			const data = await response.json();
			if (response.ok) {
				const filteredExpenses = data.filter(
					(expense) => expense.budgetId === budget._id,
				);
				setExpenses(filteredExpenses);
			} else {
				console.error(data.message);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useFocusEffect(
		useCallback(() => {
			getExpenses();
		}, [budget._id]), // Dependency on `budget._id` ensures the effect is triggered when the budget changes
	);

	return (
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
			<View style={styles.buttonContainer}>
				<Button
					title="Update"
					color="blue"
					onPress={() => handleEditClick(budget)}
				/>
				<Button
					title="Add Expense"
					color="black"
					onPress={() => setExpenseFormOpen(true)}
				/>
				<Button
					title="Delete"
					color="red"
					onPress={() => {
						deleteBudget(budget._id);
					}}
				/>
			</View>
			{expenses.length > 0 && (
				<View>
					{expenses.map((expense) => {
						return (
							<Expense
								key={expense._id}
								expense={expense}
								getExpenses={getExpenses}
								getToken={getToken}
								setExpenses={setExpenses}
								expenses={expenses} // Ensure expenses is passed down
							/>
						);
					})}
				</View>
			)}
			{expenseFormOpen && (
				<ExpenseForm
					budget={budget}
					getToken={getToken}
					setExpenseFormOpen={setExpenseFormOpen}
					setExpenses={setExpenses}
					expenses={expenses}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	budgetContainer: {
		backgroundColor: '#fff',
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	budgetText: {
		fontSize: 16,
		color: '#555',
	},
	budgetDate: {
		fontSize: 14,
		color: '#888',
	},

	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 10,
	},
});
