import { BluetoothEscposPrinter as BluetoothPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer'

export const connect = async (address) => {
    try {            
        await BluetoothManager.connect(address)
        alert(`Printer Connected`)            
        return true
    } catch (error) {
        alert(error)
        return false
    }
}

export const printData = async (data) =>{
    const title = {
        fonttype: 8,
        heightTimes:3,
        widthtimes: 2
    }

    const subtitle = {
        fonttype: 8,
    }

    const productColumnWidths = [12, 23, 6, 6]
    const productColumnAligns = [BluetoothPrinter.ALIGN.LEFT, BluetoothPrinter.ALIGN.LEFT, BluetoothPrinter.ALIGN.RIGHT, BluetoothPrinter.ALIGN.RIGHT]

    try {
        await BluetoothPrinter.printerAlign(BluetoothPrinter.ALIGN.CENTER)
        await BluetoothPrinter.printText( `${data.type} \r\n\r\n`, title );
        await BluetoothPrinter.printerAlign(BluetoothPrinter.ALIGN.LEFT)
        await BluetoothPrinter.printText( `Fecha: ${data.date} Hora:${data.time} \r\n`, subtitle);
        await BluetoothPrinter.printText( `Usuario: ${data.user} \r\n`, subtitle);
        await BluetoothPrinter.printText( `Dispositivo:${data.deviceName} \r\n`, subtitle);
        await BluetoothPrinter.printText("------------------------------------------------\r\n", {});
        await BluetoothPrinter.printText("Articulo    Descripcion              Qty   Costo\r\n", {});
        await BluetoothPrinter.printText("------------------------------------------------\r\n", {});
        
        for ( const product of data.products ){
            await BluetoothPrinter.printColumn(
                productColumnWidths,
                productColumnAligns,
                [`${product?.code}`, `${product?.description}`, `${product?.quantity}`, `$${product?.cost}`],
                {}
            )
            await BluetoothPrinter.printText( `\r\n`, subtitle);
        }
        await BluetoothPrinter.printText( `Observaciones: ${data.observations} \r\n`, subtitle);


        await BluetoothPrinter.printText( `\r\n\r\n`, subtitle);
    } catch (error) {
        alert(`Printer not connected ${error}`)            
        return false
    }
}

export const scanDevices = async () =>{
    try {
        const isBluetoothEnabled = await BluetoothManager.isBluetoothEnabled()
        if(!isBluetoothEnabled) throw 'El Bluetooth está apagado'
        const devices = await BluetoothManager.scanDevices()
        return JSON.parse(devices)
    } catch (error) {
        alert(error)
    }
}

export const isPrinterConnected = async () =>{
    try{
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
        return true
    } catch(error){
        return false
    }
}