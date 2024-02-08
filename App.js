import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddContact from './component/AddContact';
import ContactListScreen from './component/ContactListScreen';
import UpdateScreen from './component/UpdateScreen';
import FavouriteScreen from './component/FavouriteScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const OtherScreensStack = () => (
 <Stack.Navigator 
  initialRouteName="ContactListScreen">
    <Stack.Screen
      name="ContactListScreen"
      component={ContactListScreen}
      options={{
         headerMode: 'none',
      }}
    />
    <Stack.Screen name="AddContactScreen" component={AddContact} />
    <Stack.Screen name="UpdateScreen" component={UpdateScreen} />
 </Stack.Navigator>
);

const App = () => {
 return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="ContactListScreen"
          component={OtherScreensStack}
          options={{
            title: '', // Hide title
            tabBarLabel: 'Contacts', 
          }}
        />
        <Tab.Screen
          name="FavouriteScreen"
          component={FavouriteScreen}
          options={{
            title: '', // Hide title
            tabBarLabel: 'Favorites', 
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
 );
};

export default App;