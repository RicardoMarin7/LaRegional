import React, { useState, useEffect } from 'react'
import { Modal, Portal} from 'react-native-paper'
import { isPrinterConnected } from '../../utils/print'
import PrinterDevices from './PrinterDevices'
import PrintData from './PrintData'

const PrinterMain = ({ visible, setVisible}, props) => {
    const [printerConnected, setprinterConnected] = useState(null);

    const { 
        data = {
            type: 'Entrada',
            total: 0,
            warehouse:1,
            date:'8-27-2021',
            device:'',
            deviceName:'sdk_gphone_x86_arm',
            deviceUniqueID:'af274faed32d7ad9',
            observations: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque dignissimos aperiam possimus corrupti? Asperiores minima nostrum ea officia assumenda doloribus repellat voluptas eos suscipit reiciendis architecto illum rerum, culpa quasi',
            products: [
                {
                    code: 'SYAL0420',
                    cost: 26,
                    description: 'PRODUCTO ZEBRA DE PRUEBA',
                    line: 'GOMAS',
                    price: '120',
                    quantity: 75,
                    tax: 'IVA'
                },
                {
                    code: 'ZTS',
                    cost: 3230,
                    description: 'ZARZUELA TAITTO SALADA 1/1KG.',
                    line: 'GOMAS',
                    price: '120',
                    quantity: 1123,
                    tax: 'IVA'
                }
            ],
            time: '08:29:00',
            user: 'SUP'
        }
    } = props


    useEffect(() => {
        if(printerConnected === null){
            ( async () =>{
                const data = await isPrinterConnected()
                setprinterConnected(data)
            }
            )()
        }
    }, []);

    return (
        <Portal>
            <Modal 
                visible={visible}
                dismissable={false}
            >  
                { printerConnected ? <PrintData setVisible={setVisible} data={data} /> : <PrinterDevices setPrinterConnected={setprinterConnected} />}
            </Modal>
        </Portal>
    );
}
 
export default PrinterMain;