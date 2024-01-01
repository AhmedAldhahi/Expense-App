import {Text, StyleSheet, View} from "react-native";
import ExpensesOutput from "../Components/ExpensesOutput/ExpensesOutput";
import {useContext} from "react";
import {ExpensesContext} from "../store/expenses-context";

function AllExpenses(){
    const expensesCtx = useContext(ExpensesContext)
    return <ExpensesOutput
        expenses={expensesCtx.expenses}
        expensesPeriod={"Total"}
        fallBackText={"No registered expenses found!"}
    />
}

export default AllExpenses;

const styles = StyleSheet.create({
    rootContainer:{
        margin: 10,
        borderWidth: 10,
        borderColor: 'pink',
        padding: 20,
    },
    text:{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
        fontStyle: 'italic',
        textDecorationLine: 'underline'

    },
    ciel:{
        color: 'purple'
    }
})