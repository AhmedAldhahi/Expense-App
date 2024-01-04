import {createContext, useReducer} from "react";

// const DUMMY_EXPENSES = [
//     {
//         id: 'e1',
//         description: 'A pair of shoes',
//         amount: 59.99,
//         date: new Date('2021-12-19')
//
//     },
//     {
//         id: 'e2',
//         description: 'A pair of trouser',
//         amount: 29.49,
//         date: new Date('2023-1-5')
//
//     },
//     {
//         id: 'e3',
//         description: 'some bananas',
//         amount: 5.99,
//         date: new Date('2024-1-1')
//
//     },
//     {
//         id: 'e4',
//         description: 'A book',
//         amount: 14.98,
//         date: new Date('2023-02-19')
//
//     },
//     {
//         id: 'e5',
//         description: 'pc',
//         amount: 1599.00,
//         date: new Date('2022-04-24')
//
//     }
//
// ]

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({description, amount, date})=>{},
    setExpenses: (expenses)=>{},
    deleteExpense: (id)=>{},
    updateExpense: (id, {description, amount, date})=>{}
});

function expensesReducer(state, action){
    switch (action.type){
        case 'ADD':
            //const id = new Date().toString() + Math.random().toString();
            //we don't need id because firebase generates unique id that we can use and have to use to post or delete later
            return [action.payload,...state];
        //here we expect the full object that has the firebase id aswell
        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
            return action.payload;
        case 'UPDATE':
            const updatableExpenseIndex = state.findIndex((expense)=>
                expense.id === action.payload.id);
            const updatableExpense = state[updatableExpenseIndex];
            const updatedItem = {...updatableExpense, ...action.payload.data};
            const updatedExpenses = [...state];
            updatedExpenses[updatableExpenseIndex] = updatedItem;
            return updatedExpenses;

        case 'DELETE':
            return state.filter((expense)=> expense.id !== action.payload);
        default:
            return state;
    }
}

function ExpensesContextProvider({children}){
    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    function addExpense(expenseData){
        dispatch({type: 'ADD', payload: expenseData});
    }
    //function setExpenses(expenses){
    //    dispatch({type: 'SET', payload: expenses});
    //}

    function deleteExpense(id){
        dispatch({type: 'DELETE', payload: id})
    }
    function updateExpense(id, expenseData)
    {
        dispatch({type: 'UPDATE', payload: {id: id, data: expenseData}});
    }

    const value = {
        expenses: expensesState,
        addExpense: addExpense,
        setExpenses: setExpenses,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense,
    };


    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

export default ExpensesContextProvider;