import React, { useState, useEffect } from 'react'
import { ScrollView, View} from 'react-native'
import { Button, Title, ActivityIndicator } from 'react-native-paper'
import { scanDevices, connect } from '../../utils/print'
import { map, size } from 'lodash'

const PrinterDevices = ({setPrinterConnected, setVisible}) => {
    const [devices, setDevices] = useState(null);
    const [enabledDevices, setEnabledDevices] = useState(true);

    useEffect(() => {
        if(devices === null){
            (
                async () =>{
                    try {
                        const data = await scanDevices()
                        setDevices(data)
                    } catch (error) {
                        alert(error)
                    }
                }
            )()
        }
    }, []);

    useEffect(() => {
        console.log(devices)
    }, [devices]);

    const connectDevice = async (address) =>{
        setEnabledDevices(false)
        try {
            const connection = await connect(address)
            if(connection) setPrinterConnected(true)
            if(!connection) throw 'No se pudo conectar a la impresora'
        } catch (error) {
            alert(error)
            setEnabledDevices(true)
        }
    }

    if(devices === null){
        return(
            <View style={{alignContent:"center", justifyContent:'center'}}> 
                <Title style={{textAlign:'center', color:'white'}}>Cargando Dispositivos Bluetooth</Title>
                <ActivityIndicator animating={true} size={72} />
            </View>
        )
    }
    
    return (
        <ScrollView>
            <Title style={{textAlign:'center'}}>Conectar a impresora</Title>
            {size(devices?.paired) > 0 && (
                map(devices.paired, device =>(
                    <Button
                        mode='contained'
                        disabled={!enabledDevices}
                        compact
                        dark
                        key={device.address}
                        onPress={() => connectDevice(device?.address)}
                    >
                        {`${device?.name} ${device?.address}`}
                    </Button>
                ))
            )}

            <Button
                mode='outlined'
                compact
                dark
                key={'close'}
                onPress={() => setVisible(false) }
            >
                Cerrar
            </Button>
        </ScrollView>
    );
}
 
export default PrinterDevices;