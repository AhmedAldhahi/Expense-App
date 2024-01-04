import {TextInput, View, StyleSheet, Text, Alert} from "react-native";
import Input from "./Input";
import {useState} from "react";
import Button from "../UI/Button";
import {getFormattedDate} from "../../util/date";
import {GlobalStyles} from "../../constants/styles";

function ExpenseForm({onCancel, onSubmit, submitButtonLabel, defaultValues}) {
    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString(): '',
            isValid: true,
        },

        date: {
            value: defaultValues ? getFormattedDate(defaultValues.date) : '',
            isValid: true,
        },
        description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true,
        },
    });
    function inputChangedHandler(inputIdentifier, enteredValue){
        setInputs((curInputs)=>{
            return{
                ...curInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true }
                //this allows to dynamically target and set property names

            };
        });
    }
    function submitHandler(){
        const expenseData = {
            amount: +inputs.amount.value, //the plus converts the value into integer
            date: new Date(inputs.date.value),
            description: inputs.description.value
        };

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dateIsValid = expenseData.date.toString() !== "Invalid Date";
        //this is a JS thing where when you write a non date in a new Date("hello") you will get Invalid Date as a string
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if(!amountIsValid || !dateIsValid || !descriptionIsValid){
            //show feedback
            setInputs((curInputs)=> {
                return {
                    amount: {value: curInputs.amount.value, isValid: amountIsValid},
                    date: {value: curInputs.date.value, isValid: dateIsValid},
                    description: {value: curInputs.description.value, isValid: descriptionIsValid}
                }
            })
            //Alert.alert('Invalid input', 'Please check your input values ');
            return;
        }

        onSubmit(expenseData);//this onSubmit prop that takes a value which is an object now we have access to expenseData
        //inside manageExpenses screen where the component ExpenseForm is being rendered
    }

    //we made a style array in input component and put on a view and we made input takes style as prop and added
    //it to both inputs components here so they both get equally size because it that is the only way adding it to a view
    //here doesn't work
    const formIsValid =
        !inputs.amount.isValid ||
        !inputs.date.isValid ||
        !inputs.description.isValid;

    return <View style={styles.form}>
        <Text style={styles.title}>Your Expense</Text>
        <View style={styles.inputsRow}>
        <Input style={styles.rowInput}
               label={"Amount"}
               invalid={!inputs.amount.isValid}
               textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'amount'),
            value: inputs['amount'].value,
        }}/>
        <Input style={styles.rowInput}
               label={"Date"}
               invalid={!inputs.date.isValid}
               textInputConfig={{
            placeholder: 'YYYY-MM-DD',
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, 'date'),
            value: inputs.date.value

        }}/>
        </View>
        <Input label={"Description"}
               invalid={!inputs.description.isValid}
               textInputConfig={{
            multiline: true,
            onChangeText: inputChangedHandler.bind(this, 'description'),
            value: inputs.description.value,

        }}/>
        {formIsValid && <Text style={styles.errorText}>Invalid input values</Text>}
        <View style={styles.buttons}>
            <Button style={styles.button} mode={'flat'} onPress={onCancel}>Cancel</Button>
            <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
        </View>
    </View>
}
export default ExpenseForm;

const styles = StyleSheet.create({
    inputsRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInput:{
        flex: 1
    },
    errorText:{
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8
    },
    form:{
        marginTop: 40,

    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 20,
        textAlign: 'center'

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