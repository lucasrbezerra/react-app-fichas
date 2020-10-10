import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackDiary } from './src/screens/DiaryScreen';
import { StackCharged } from './src/screens/ChargedScreen';
import { StackClient } from './src/screens/UsersScreen';
import { CalculatorScreen } from './src/screens/CalculatorScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import FlashMessage from "react-native-flash-message";

const Tab = createMaterialBottomTabNavigator();

export default function App() {

  return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Principal"
          backBehavior="history"
          activeColor='white'
          barStyle={{ backgroundColor: '#660000', borderRadius: 30}}
        >
        <Tab.Screen
          title="Principal"
          name="Diária"
          component={StackDiary}
          options={{
            tabBarIcon: ({}) => (
              <Icon name="calendar" size={24} color={'white'} />
            ),
          }}
        />
        <Tab.Screen
          name="Calculadora"
          component={CalculatorScreen}
          options={{
            tabBarColor: 'black',
            tabBarIcon: ({}) => (
              <Icon name="calculator" color={'white'} size={24} />
            ),
          }}
        />

        <Tab.Screen
          name="Charged"
          component={StackCharged}
          options={{
            tabBarLabel: 'Já Cobrados',
            tabBarIcon: ({}) => (
              <Icon name="check" color={'white'} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Root"
          component={StackClient}
          options={{
            tabBarColor: 'black',
            tabBarLabel: 'Todos',
            tabBarIcon: ({}) => (
              <Icon name="user" color={'white'} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
      <FlashMessage position='bottom' animated />
    </NavigationContainer>
  );
}

