import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ExpenseForm = ({ budget, getToken, setExpenseFormOpen, setExpenses }) => {
	const [expenseName, setExpenseName] = useState('');
	const [expenseAmount, setExpenseAmount] = useState('');

	const createExpense = async () => {
		if (!expenseName || !expenseAmount) {
			setError('All fields are required.');
			return;
		}

		try {
			const token = await getToken();

			const response = await fetch('http://192.168.1.96:5001/api/expenses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify({
					budgetId: budget._id,
					name: expenseName,
					amount: parseFloat(expenseAmount),
				}),
			});

			if (response.ok) {
				const data = await response.json();
				// Update the expenses list immediately
				setExpenseName('');
				setExpenseAmount('');
				setExpenses((prevExpenses) => [
					...prevExpenses,
					data, // Add the new expense to the list
				]);
			} else {
				const data = await response.json();
				console.error(data.message);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<View style={styles.form}>
			<TextInput
				placeholder="Expense Name"
				value={expenseName}
				onChangeText={(text) => setExpenseName(text)}
				style={styles.input}
				placeholderTextColor="#bbb"
			/>
			<TextInput
				placeholder="Expense Amount"
				value={expenseAmount}
				keyboardType="numeric"
				onChangeText={(text) => setExpenseAmount(text)}
				style={styles.input}
				placeholderTextColor="#bbb"
			/>
			<Button
				title="Submit Expense"
				color="black"
				onPress={createExpense}
			/>
			<Button
				title="Close Form"
				color="red"
				onPress={() => {
					setExpenseFormOpen(false);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
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
});

export default ExpenseForm;
