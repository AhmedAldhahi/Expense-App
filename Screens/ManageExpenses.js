import {Text, View, StyleSheet} from "react-native";
import {useContext, useLayoutEffect} from "react";
import IconButton from "../Components/UI/IconButton";
import {GlobalStyles} from "../constants/styles";
import Button from "../Components/UI/Button";
import {ExpensesContext} from "../store/expenses-context";
import ExpenseForm from "../Components/ManageExpense/ExpenseForm";
import {storeExpense} from "../util/http";

function ManageExpenses({route, navigation}){

    const expensesCtx = useContext(ExpensesContext)
    const editedExpenseId = route.params?.expenseId;
    //safe way to drill into an object that might be undefiend
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find(
        (expense) => expense.id === editedExpenseId
    );


    //to avoid its flickering initially use layoureffect

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense',
        });
    }, [navigation, isEditing]);

    function deleteExpenseHandler(){
        expensesCtx.deleteExpense(editedExpenseId);
        navigation.goBack();

    }

    function cancelHandler(){
        navigation.goBack();
    }
    async function confirmHandler(expenseData){
        if(isEditing){
            expensesCtx.updateExpense(editedExpenseId, expenseData);
        }
        else{
            const id = await storeExpense(expenseData);
            expensesCtx.addExpense({...expenseData, id: id});
            //so now the id generated by fire base is also a part of the object that we send to the context
        }
        navigation.goBack();
    }

    return <View style={styles.container}>
        <ExpenseForm
            onCancel={cancelHandler}
            submitButtonLabel={isEditing ? 'Update' : 'Add'}
            onSubmit={confirmHandler}
            defaultValues={selectedExpense}
        />


        {isEditing && (
            <View style={styles.deleteContainer}>
                <IconButton icon={"trash"}
                                      color={GlobalStyles.colors.error500}
                                      size={36}
                                      onPress={deleteExpenseHandler}
                />
            </View>
        )}
    </View>
}

export default ManageExpenses;

const styles = StyleSheet.create({
    deleteContainer:{
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center'
    },
    container:{
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },

})