import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AllExpenses from "./Screens/AllExpenses";
import ManageExpenses from "./Screens/ManageExpenses";
import RecentExpenses from "./Screens/RecentExpenses";
import {StatusBar} from "expo-status-bar";
import {BottomTabBar, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {GlobalStyles} from "./constants/styles";
import {Ionicons} from '@expo/vector-icons'
import IconButton from "./Components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ExpensesOverview() {
    return (
        <Tab.Navigator screenOptions={({navigation}) => ({
            headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
            headerTintColor: 'white',
            tabBarStyle: {backgroundColor: GlobalStyles.colors.primary500},
            tabBarActiveTintColor: GlobalStyles.colors.accent500,
            headerRight: ({tintColor}) => (<IconButton
                    icon={"add"}
                    size={24}
                    color={tintColor}
                    onPress={() => {
                        navigation.navigate('ManageExpenses')
                    }}
                />
            ),
        })}
        >
            <Tab.Screen
                name="RecentExpenses"
                component={RecentExpenses}
                options={{
                    title: 'Recent Expenses',
                    tabBarLabel: 'Recent',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name={'hourglass'} size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="AllExpenses"
                component={AllExpenses}
                options={{
                    title: 'All Expenses',
                    tabBarLabel: 'All Expenses',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name={'calendar'} size={size} color={color}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <>
            <StatusBar style={"light"}/>
            <ExpensesContextProvider>
                <NavigationContainer><Stack.Navigator screenOptions={{
                    headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
                    headerTintColor: 'white',
                }}>
                    <Stack.Screen name="ExpensesOverview"
                                  component={ExpensesOverview}
                                  options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="ManageExpenses"
                        component={ManageExpenses}
                        options={{
                            presentation: 'modal',
                        }}
                    />

                </Stack.Navigator>
                </NavigationContainer>
            </ExpensesContextProvider>
        </>
    );
}


