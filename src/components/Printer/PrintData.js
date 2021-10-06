import React, { useState } from 'react'
import { View } from 'react-native'
import { Title, Button } from 'react-native-paper'
import { printData } from '../../utils/print'

const PrintData = ({data, setVisible}) => {
    const printOnBluetoothPrinter = async () =>{
            await printData(data)
    }

    return (
        <View>
            <Title style={{textAlign:'center'}}>¿Desea imprimir?</Title>
            <View style={{flexDirection:'row'}}>
                <Button
                    style={{flex:2, marginHorizontal: 10}}
                    dark
                    mode='outlined'
                    onPress={ () => setVisible(false)}
                >
                    No
                </Button>
                <Button
                    style={{flex:2, marginHorizontal: 10}}
                    dark
                    mode='contained'
                    onPress={ () => printOnBluetoothPrinter(data)}
                >
                    Si
                </Button>
            </View>
        </View>
    );
}
 
export default PrintData;