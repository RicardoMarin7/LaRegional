import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../screens/home'
import Exits from '../screens/exits'
import Entries from '../screens/entries'
import Purchases from '../screens/purchases'
import FastArticle from '../screens/fastarticle'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IconButton } from 'react-native-paper'

// const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const Navigation = () => {
    return (
        <Tab.Navigator
            screenOptions={ ({ route }) => ({
                tabBarIcon: ({ focused, color, size}) => {
                    let iconName

                    switch(route.name){
                        case 'home':
                            iconName = 'home' 
                        break

                        case 'exits':
                            iconName = 'exit-to-app'
                        break

                        case 'entries':
                            iconName = 'archive-arrow-up'
                        break

                        case 'purchases':
                            iconName = 'cart'
                        break

                        case 'fastarticle':
                            iconName = 'plus-thick'
                        break
                    }

                    return <IconButton icon={ iconName } size = {size} color= {color} />
                }
            })}

            tabBarOptions= {{
                activeTintColor: '#f04e60',
                inactiveTintColor: '#777777',
            }}

            
        >


            <Tab.Screen name='home' component={Home} options={{title: 'Home'}}/>
            <Tab.Screen name='exits' component={Exits} options={{title: 'Salidas'}}/>
            <Tab.Screen name='entries' component={Entries} options={{title: 'Entradas'}}/>
            <Tab.Screen name='purchases' component={Purchases} options={{title: 'Compras'}}/>
            <Tab.Screen name='fastarticle' component={FastArticle} options={{title: 'Alta Rápida'}}/>
        </Tab.Navigator>
    );
}
 
export default Navigation;