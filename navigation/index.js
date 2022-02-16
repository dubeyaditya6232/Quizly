import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Quiz from '../screens/Quiz';
import Result from '../screens/Result';
import Dashboard from '../screens/Dashboard';
import Register from '../screens/Register';
import Login from '../screens/Login';
import AdminLogin from '../screens/AdminLogin';
import AddQuestions from '../screens/AddQuestions';
import CreateTest from '../screens/CreateTest';
import CoordinatorDashboard from '../screens/CoordinatorDashboard';
import EditTest from '../screens/EditTest';
import TestDetails from '../screens/TestDetails';
import TestResult from '../screens/TestResult';

import { UserAuthContextProvider } from '../useContext';

const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <UserAuthContextProvider>
            <Stack.Navigator initialRouteName='Home' >
                {/** public routes */}
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ headerShown: false }} />
                {/** protected routes */}
                <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
                <Stack.Screen name="Quiz" component={Quiz} options={{ headerShown: false }} />
                <Stack.Screen name='Result' component={Result} options={{ headerShown: false }} />
                <Stack.Screen name="AddQuestions" component={AddQuestions} options={{ headerShown: false }} />
                <Stack.Screen name="CreateTest" component={CreateTest} options={{ headerShown: false }} />
                <Stack.Screen name="CoordinatorDashboard" component={CoordinatorDashboard} options={{ headerShown: false }} />
                <Stack.Screen name="EditTest" component={EditTest} options={{ headerShown: false }} />
                <Stack.Screen name="TestDetails" component={TestDetails} options={{ headerShown: false }} />
                <Stack.Screen name="TestResults" component={TestResult} options={{ headerShown: false }} />
            </Stack.Navigator>
        </UserAuthContextProvider>
    );
}

export default MyStack;