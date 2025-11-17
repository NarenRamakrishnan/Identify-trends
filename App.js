import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import NewUserScreen from './screens/NewUser';
import ForgotPassword from './screens/ForgotPassword';
import HomeScreen from './screens/Home';
import ProjectScreen from './screens/Project';
import FunctionScreen from './screens/Function';
import CompareScreen from './screens/Compare';
import LoadOldProjectScreen from './screens/OpenOldProject';
import ProjectDetailsScreen from './screens/ProjectDetails';
import HandbookScreen from './screens/HandBook';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="NewUser" 
          component={NewUserScreen} 
          options={{ title: 'Create New User' }} 
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ title: 'Forgot Password' }} 
        />
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ title: 'Home Screen' }} 
        />
        <Stack.Screen 
          name="ProjectScreen" 
          component={ProjectScreen} 
          options={{ title: 'New Project' }} 
        />    
        <Stack.Screen 
          name="FunctionScreen" 
          component={FunctionScreen} 
          options={{ title: 'Predicted Trend' }} 
        />   
        <Stack.Screen 
          name="CompareScreen" 
          component={CompareScreen} 
          options={{ title: 'Compare Data' }} 
        />  
        <Stack.Screen 
          name="OpenOldProject" 
          component={LoadOldProjectScreen} 
          options={{ title: 'Old Projects' }} 
        />          
        <Stack.Screen 
        name="ProjectDetails" 
        component={ProjectDetailsScreen} 
        options={{ title: 'Project details' }} 
      />
        <Stack.Screen 
        name="HandBook" 
        component={HandbookScreen} 
        options={{ title: 'Handbook' }} 
      />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
