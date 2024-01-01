import {FlatList, Text} from "react-native";
import ExpenseItem from "./ExpenseItem";

function renderExpenseItem(itemData){
    const item = itemData.item
    return <ExpenseItem
        id={item.id}
        date={item.date}
        amount={item.amount}
        description={item.description}

    />
}

function ExpensesList({expenses}){
    return <FlatList data={expenses}
                     keyExtractor={(expense) =>{expense.id}}
                     renderItem={renderExpenseItem}/>
}

export default ExpensesList;