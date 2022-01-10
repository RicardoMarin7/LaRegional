import React, { useState, useEffect } from 'react'
import { Modal, Portal, Text} from 'react-native-paper'
import { isPrinterConnected, printData} from '../../utils/print'
import PrinterDevices from './PrinterDevices'

const PrinterMain = ({visible, setVisible, data}) => {
    const [printerConnected, setprinterConnected] = useState(null);

    useEffect(() => {
        if(printerConnected === null){
            ( async () =>{
                const data = await isPrinterConnected()
                setprinterConnected(data)
            }
            )()
        }
    }, [data]);

    useEffect(() => {
        if(printerConnected){
            printData(data, setVisible)
        }
    }, [printerConnected]);

    return (
        <Portal>
            <Modal 
                visible={visible}
                dismissable={false}
            > 
                <PrinterDevices 
                    setPrinterConnected={setprinterConnected} 
                    printerConnected={printerConnected}
                    setVisible={setVisible}
                    data={data}
                />
            </Modal>
        </Portal>
    );
}
 
export default PrinterMain;