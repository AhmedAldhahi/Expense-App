import {Text} from "react-native";
import ExpensesOutput from "../Components/ExpensesOutput/ExpensesOutput";
import {useContext, useEffect, useState} from "react";
import {ExpensesContext} from "../store/expenses-context";
import {getDateMinusDays} from "../util/date";
import {fetchExpenses} from "../util/http";
import LoadingOverlay from "../Components/UI/LoadingOverlay";
import ErrorOverlay from "../Components/UI/ErrorOverlay";

function RecentExpenses(){
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();
    const expensesCtx = useContext(ExpensesContext);

    useEffect(() => {
        async function getExpenses(){
            setIsFetching(true);
            try{
                const expenses = await fetchExpenses();
                expensesCtx.setExpenses(expenses);
            } catch (error){
                setError('Could not fetch expenses!');
            }
            // fetchExpenses now yields a promise and that means we can wait to that promise to resolve to get the data we need
            //so we add async await

            setIsFetching(false);


            //adding async to a function enforce, ensures, makes that function return a promise
            //discourged by the react native team to turn useEffect function to async await
        }

        getExpenses();
        //sending a http request is an asynchronous task (means it doesn't complete immediately)
        //explore what promises are (javaScript concept) (in short a promise is an object that will eventually give you
        //access to some other data
    }, []);
    //IMPORTANT: now if we make a new expense and add it will be added to the database but you won't see it in the recentExpenses
    //screen because when you add na expense you open a new screen but the old recentscreen still runs in the background
    //so that means that the useEffect won't excute there is way to fix this but the suggestion is that we keep using
    //useContext and anaditional benefit is that we have to send less http request because we don't have to fetch new data from
    //the backend because we added a new expense

    //we going to add a set function on our context so that we also set expenses when we initially fetch them so when we get
    //expenses from the backend we can set them to out context and then we work on these fetched and set expenses there after
    // in the app

    function errorHandler(){
        setError(null);
    }

    if(error && !isFetching){
        return <ErrorOverlay
            message={error}
            onConfirm={errorHandler}
        />
    }

    if(isFetching){
        return <LoadingOverlay />
    }

    const recentExpenses = expensesCtx.expenses.filter((expense)=>{
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);

        return (expense.date >= date7DaysAgo) && (expense.date <= today);
    })

    return <ExpensesOutput
        expenses={recentExpenses}
        expensesPeriod={"Last 7 days"}
        fallBackText={"No expenses registered for the last 7 days"}
    />
}

export default RecentExpenses;