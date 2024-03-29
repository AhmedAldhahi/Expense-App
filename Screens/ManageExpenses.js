import {Text, View, StyleSheet} from "react-native";
import {useContext, useLayoutEffect, useState} from "react";
import IconButton from "../Components/UI/IconButton";
import {GlobalStyles} from "../constants/styles";
import Button from "../Components/UI/Button";
import {ExpensesContext} from "../store/expenses-context";
import ExpenseForm from "../Components/ManageExpense/ExpenseForm";
import {deleteExpense, storeExpense, updateExpense} from "../util/http";
import LoadingOverlay from "../Components/UI/LoadingOverlay";
import ErrorOverlay from "../Components/UI/ErrorOverlay";

function ManageExpenses({route, navigation}){
    const [error, setError] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    async function deleteExpenseHandler(){
        //here the order doesn't matter whether you delete locally first or not
        setIsSubmitting(true);
        try{
            await deleteExpense(editedExpenseId);
            expensesCtx.deleteExpense(editedExpenseId);
            navigation.goBack();
        }catch (error){
            setError('Could not delete expense! - please try again later')
            setIsSubmitting(false);
        }




    }

    function cancelHandler(){
        navigation.goBack();
    }
    async function confirmHandler(expenseData){
        setIsSubmitting(true);
        try{
            if(isEditing){
                    expensesCtx.updateExpense(editedExpenseId, expenseData);
                    await updateExpense(editedExpenseId, expenseData);

                //here we update locally first then we update on firebase
                //but in the addExpense under we need the id from FIREBASE then we add it locally so we can use that unique id
                //from firebase
            }
            else{
                    const id = storeExpense(expenseData);
                    expensesCtx.addExpense({...expenseData, id: id});
                //const id = await storeExpense(expenseData);
                //expensesCtx.addExpense({...expenseData, id: id});

                //so now the id generated by fire base is also a part of the object that we send to the context
            }
            navigation.goBack();
        }catch (error){
            setError('Could not save expense! - please try again later');
            setIsSubmitting(false);
        }



    }

    function errorHandler(){
        setError(null);
    }
    if(error && !isSubmitting){
        return <ErrorOverlay
            message={error}
            onConfirm={errorHandler}
        />
    }

    if(isSubmitting){
        return <LoadingOverlay/>
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