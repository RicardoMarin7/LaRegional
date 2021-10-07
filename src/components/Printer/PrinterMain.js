import React, { useState, useEffect } from 'react'
import { Modal, Portal} from 'react-native-paper'
import { isPrinterConnected } from '../../utils/print'
import PrinterDevices from './PrinterDevices'
import PrintData from './PrintData'

const PrinterMain = ({ visible, setVisible, data}) => {
    const [printerConnected, setprinterConnected] = useState(null);

    useEffect(() => {
        if(printerConnected === null){
            ( async () =>{
                const data = await isPrinterConnected()
                setprinterConnected(data)
            }
            )()
        }
    }, []);

    useEffect(() => {
        
    }, [data]);

    return (
        <Portal>
            <Modal 
                visible={visible}
                dismissable={false}
            >  
                { printerConnected ? <PrintData setVisible={setVisible} data={data} /> : <PrinterDevices setPrinterConnected={setprinterConnected} setVisible={setVisible}/>}
            </Modal>
        </Portal>
    );
}
 
export default PrinterMain;