import { StyleSheet, Button } from 'react-native';
import { View, Text } from 'react-native';
import ExpenseForm from './ExpenseForm';

export default function Budget({
	budget,
	deleteBudget,
	handleEditClick,
	expenseFormOpen,
	setExpenseFormOpen,
	// setCurrentBudgetId,
	getToken,
}) {
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
					onPress={() => setExpenseFormOpen(true)} // open expense form
				/>
				<Button
					title="Delete"
					color="red"
					onPress={() => {
						deleteBudget(budget._id);
					}}
				/>
			</View>
			{expenseFormOpen && (
				<ExpenseForm
					budget={budget}
					getToken={getToken}
					setExpenseFormOpen={setExpenseFormOpen}
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
