import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../screens/home'
import Existence from '../screens/existence'

const HomeStack = () => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator>
            <Stack.Screen name='home' component={Home} options={{title: 'Home'}} />
            <Stack.Screen name='existence' component={Existence} options={{title: 'Existencia'}} />
        </Stack.Navigator>
    )
}
export default HomeStack;