import { View, Text, StyleSheet, Button } from 'react-native';

export default function Expense({ expense, getToken, setExpenses, expenses }) {
	const deleteExpense = async (expenseId) => {
		try {
			const token = await getToken();
			const response = await fetch(
				`http://192.168.1.96:5001/api/expenses/${expenseId}`,
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

				// Remove the deleted expense from the state without refreshing the entire list
				const updatedExpenses = expenses.filter((exp) => exp._id !== expenseId);
				setExpenses(updatedExpenses); // Update state
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.expenseDetails}>
				<Text style={styles.expenseName}>{expense.name}</Text>
				<Text style={styles.expenseAmount}>${expense.amount}</Text>
			</View>
			<Text style={styles.expenseDate}>
				{new Date(expense.date).toLocaleDateString('en-us')}
			</Text>
			<View style={styles.buttonContainer}>
				<Button
					title="Delete"
					color="red"
					onPress={() => deleteExpense(expense._id)}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		padding: 10,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	expenseDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	expenseName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	expenseAmount: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	expenseDate: {
		fontSize: 14,
		color: '#888',
		textAlign: 'right',
	},
	buttonContainer: {
		marginTop: 10,
	},
});
