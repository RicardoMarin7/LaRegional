import React from 'react'
import { Button } from 'react-native-paper'


const MainButton = (props) => {
    const {
        execute = () => alert('No tiene una funcion asignada'),
        title='Boton sin titulo',
        icon = 'help'
    }= props
    return (
        <Button 
                mode="contained" 
                dark
                icon={icon}
                style={{ margin:10}}
                onPress={() => execute()}
                labelStyle={{fontSize: 16}}
                >
                {title}
        </Button>
    );
}
 
export default MainButton;