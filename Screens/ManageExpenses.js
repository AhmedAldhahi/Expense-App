import {Text, View, StyleSheet} from "react-native";
import {useContext, useLayoutEffect} from "react";
import IconButton from "../Components/UI/IconButton";
import {GlobalStyles} from "../constants/styles";
import Button from "../Components/UI/Button";
import {ExpensesContext} from "../store/expenses-context";

function ManageExpenses({route, navigation}){

    const expensesCtx = useContext(ExpensesContext)
    const editedExpenseId = route.params?.expenseId;
    //safe way to drill into an object that might be undefiend
    const isEditing = !!editedExpenseId;


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
    function confirmHandler(){
        if(isEditing){
            expensesCtx.updateExpense(
                editedExpenseId,
                {
                description: 'TestUpdate',
                amount: 28.99,
                date: new Date('2023-12-30'),
            }
            );
        }
        else{
            expensesCtx.addExpense(
                {
                    description: 'Test',
                    amount: 19.99,
                    date: new Date('2024-1-1'),
                });
        }
        navigation.goBack();
    }

    return <View style={styles.container}>
        <View style={styles.buttons}>
            <Button style={styles.button} mode={'flat'} onPress={cancelHandler}>Cancel</Button>
            <Button style={styles.button} onPress={confirmHandler}>{isEditing ? 'Update' : 'Add'}</Button>
        </View>
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
    buttons:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        minWidth: 120,
        marginHorizontal: 8,
    }
})