import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../screens/home'
import Existence from '../screens/existence'
import Existence2 from '../screens/existence2'

const HomeStack = () => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator>
            <Stack.Screen name='home' component={Home} options={{title: 'Home'}} />
            <Stack.Screen name='existence' component={Existence} options={{title: 'Existencia Almacen 1'}} />
            <Stack.Screen name='existence2' component={Existence2} options={{title: 'Existencia Almacen 2'}} />
        </Stack.Navigator>
    )
}
export default HomeStack;