import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const BudgetForm = ({
	name,
	setName,
	amount,
	setAmount,
	startDate,
	handleStartDateChange,
	endDate,
	handleEndDateChange,
	onSubmit,
	onClose,
	currentBudgetId,
}) => {
	return (
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
				title={currentBudgetId ? 'Update Budget' : 'Submit'}
				color={'black'}
				onPress={onSubmit}
			/>
			<Button
				title="Close Form"
				color="red"
				onPress={onClose}
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
	label: {
		marginTop: 10,
		fontSize: 14,
		color: '#666',
	},
});

export default BudgetForm;
